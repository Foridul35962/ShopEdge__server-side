import Order from "../models/Order.model.js";
import ApiErrors from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getOrder = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    const orders = await Order.find({user:userId}).sort({createdAt:-1})

    if (!orders) {
        throw new ApiErrors(404, 'orders is not found')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, orders, 'order fatched successfully')
        )
})

export const getOrderDetails = asyncHandler(async(req, res)=>{
    const orderId = req.params?._id

    const order = await Order.findById(orderId).populate('user', 'name email')
    if (!order) {
        throw new ApiErrors(404, 'order is not found')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, order, 'order details fatched successfully')
        )
})