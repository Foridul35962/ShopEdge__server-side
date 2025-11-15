import ApiErrors from "../utils/ApiErrors.js";
import asyncHandler from "../utils/asyncHandler.js";

const checkAdmin = asyncHandler(async(req, res, next)=>{
    if (req.user.role !== 'admin') {
        throw new ApiErrors(403, 'Authentication failed')
    }
    next()
})

export default checkAdmin