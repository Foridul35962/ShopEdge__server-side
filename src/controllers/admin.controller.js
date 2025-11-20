import { check, validationResult } from "express-validator";
import Users from "../models/Users.model.js";
import ApiErrors from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


export const getUsers = asyncHandler(async (req, res) => {
    const users = await Users.find().select('-password')

    if (!users) {
        throw new ApiErrors(404, 'user not found')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, users, 'user fetched successfully')
        )
})

export const addAdmin = [
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
        const {name, email, password} = req.body
        if (!name || !email || !password) {
            throw new ApiErrors(400, 'all fields are required')
        }

        const error = validationResult(req)
        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'wrong input value', error.array())
        }

        const dublicateUser = await Users.findOne({email})
        if (dublicateUser ) {
            throw new ApiErrors(400, 'this email is already used')
        }

        const user = new Users({
            name,
            email,
            password,
            role: 'admin'
        })

        await user.save()

        user.password = undefined

        return res
            .status(200)
            .json(
                new ApiResponse(200, user, 'admin added successfully')
            )
    })
]