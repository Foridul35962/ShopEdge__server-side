import Subscriber from "../models/Subscriber.model.js";
import ApiErrors from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addSubscriber = asyncHandler(async(req, res)=>{
    const {email} = req.body

    if (!email) {
        throw new ApiErrors(400, 'email is required')
    }

    const dublicate = await Subscriber.findOne({email})
    if (dublicate) {
        throw new ApiErrors(401, 'this email is already added')
    }

    const subscriber = await Subscriber.create({email})
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, subscriber, 'subscriber added successfully')
        )
})
