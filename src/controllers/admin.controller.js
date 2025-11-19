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