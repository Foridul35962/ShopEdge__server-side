import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import Users from '../models/Users.model.js'
import ApiErrors from '../utils/ApiErrors.js'

const verifyJWT = asyncHandler(async(req, res, next)=>{
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await Users.findById(decoded.user._id).select("-password")
            next()
        } catch (error) {
            throw new ApiErrors(401, 'Not authorized, token failed')
        }
    } else{
        throw new ApiErrors(401, "Not authorized, no token provided")
    }
})

export default verifyJWT