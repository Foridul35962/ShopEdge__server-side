import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'
import asyncHandler from '../utils/asyncHandler.js'
import ApiErrors from '../utils/ApiErrors.js'
import Users from '../models/Users.model.js'
import { generatePasswordResetMail, generateVerificationMail } from '../nodeMailer/verificationMail.js'
import { TempUsers } from '../models/TempUsers.model.js'
import transport from '../nodeMailer/config.js'
import ApiResponse from '../utils/ApiResponse.js'


export const register = [
    check('name')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Please Enter a valid Email'),
    check('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('password must be minimum 6 charecter')
        .matches(/[0-9]/)
        .withMessage('password must be has one digit')
        .matches(/[a-zA-Z]/)
        .withMessage('password must be has one alphabet'),

    asyncHandler(async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'Insert wrong value', error.array())
        }

        const { name, email, password } = req.body
        if (!name || !email || !password) {
            throw new ApiErrors(400, 'All field are required')
        }

        const dublicateUser = await Users.findOne({ email })
        if (dublicateUser) {
            throw new ApiErrors(400, 'This email is already used')
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        const expiredOtp = Date.now() + 1000 * 60 * 5
        const mailOption = generateVerificationMail(email, otp)

        //save user in temporary
        await TempUsers.findOneAndUpdate(
            { email },
            { name, email, password, otp, expiredOtp, createdAt: Date.now() },
            { upsert: true, new: true }
        )

        try {
            await transport.sendMail(mailOption)
        } catch (error) {
            throw new ApiErrors(500, 'Otp send failed')
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, 'Otp send successfully')
            )

    })
]

export const verifyEmail = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    if (!email) {
        throw new ApiErrors(400, 'Email is required')
    }

    const temp = await TempUsers.findOne({ email })
    if (!temp) {
        throw new ApiErrors(404, 'Email is not found in out temp database')
    }

    if (otp === '' || temp.otp !== otp) {
        throw new ApiErrors(400, 'Otp is not matched')
    }

    if (temp.expiredOtp.getTime() < Date.now()) {
        throw new ApiErrors(400, 'Otp is expired')
    }

    const user = await Users.create({
        name: temp.name,
        email: temp.email,
        password: temp.password,
        role: 'customer'
    })
    user.password = undefined

    await TempUsers.findOneAndDelete({ email })

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, 'user registration successfully')
        )
})

//login
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new ApiErrors(400, "email and password is required")
    }

    const user = await Users.findOne({ email })
    if (!user) {
        throw new ApiErrors(404, 'email is not found')
    }

    const isPassMatched = await user.isPasswordCorrect(password)
    if (!isPassMatched) {
        throw new ApiErrors(400, 'password is not matched')
    }

    user.password = undefined

    //create JWT token
    const payload = { user: { _id: user._id, role: user.role } }

    //sign and return the token along with user data
    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '40h' },
        (err, token) => {
            if (err) {
                throw new ApiErrors(500, 'JWT create failed')
            }

            return res
                .status(200)
                .json(
                    new ApiResponse(200, { user, token }, 'user loggedIn successfully')
                )
        }
    )
})

//get user profile
export const profile = asyncHandler(async (req, res) => {
    const user = req.user
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, 'profile fecthed successfully')
        )
})

export const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        throw new ApiErrors(400, 'email is required')
    }

    const user = await Users.findOne({ email })
    if (!user) {
        throw new ApiErrors(404, 'user is not has in database')
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const expiredOtp = Date.now() + 1000 * 60 * 5
    const mailOption = generatePasswordResetMail(email, otp)

    await TempUsers.findOneAndUpdate(
        { email },
        { email, otp, expiredOtp, createdAt: Date.now() },
        { upsert: true, new: true }
    )

    try {
        await transport.sendMail(mailOption)
    } catch (error) {
        throw new ApiErrors(500, 'otp send failed')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, 'otp send successfully')
        )
})

export const verifyPassOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body
    if (!email) {
        throw new ApiErrors(400, 'email are required')
    }

    const tempuser = await TempUsers.findOne({ email })

    if (!tempuser) {
        throw new ApiErrors(404, 'temp user not found')
    }

    if (otp === '' || tempuser.otp !== otp) {
        throw new ApiErrors(400, 'otp is not matched')
    }

    if (tempuser.expiredOtp < Date.now()) {
        throw new ApiErrors(400, 'otp is expired')
    }

    tempuser.isverified = true
    await tempuser.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, 'email verify successfully')
        )
})

export const resetPassword = [
    check('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('password must be minimum 6 charecter')
        .matches(/[0-9]/)
        .withMessage('password must be has one digit')
        .matches(/[a-zA-Z]/)
        .withMessage('password must be has one alphabet'),

    asyncHandler(async (req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            throw new ApiErrors(400, 'email and password both are required')
        }

        const error = validationResult(req)

        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'wrong password entered', error.array())
        }

        const tempUser = await TempUsers.findOne({ email })
        if (!tempUser || !tempUser.isverified) {
            throw new ApiErrors(400, 'email is not verified')
        }

        const user = await Users.findOne({ email })

        if (!user) {
            throw new ApiErrors(500, 'password reset failed')
        }

        user.password = password
        await user.save({ validateBeforeSave: false })

        user.password = undefined

        await tempUser.deleteOne()

        return res
            .status(200)
            .json(
                new ApiResponse(200, user, 'password reset successfully')
            )
    })
]