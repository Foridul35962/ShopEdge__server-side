import Order from "../models/Order.model.js";
import ApiErrors from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getOrder = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 })

    if (!orders) {
        throw new ApiErrors(404, 'orders is not found')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, orders, 'order fatched successfully')
        )
})

export const getOrderDetails = asyncHandler(async (req, res) => {
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

export const adminOrderList = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email')
    if (!orders) {
        throw new ApiErrors(404, 'order list is empty')
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, orders, 'order fetched successfully')
        )
})

export const changeOrderStatus = asyncHandler(async (req, res) => {
    const { orderId, newStatus } = req.body
    if (!orderId || !newStatus) {
        throw new ApiErrors(400, 'all fields are required')
    }

    const validStatus = ["Processing", "Shipped", "Delivered", "Cancelled"]
    if (!validStatus.includes(newStatus)) {
        throw new ApiErrors(400, 'status is not valid')
    }

    const order = await Order.findById(orderId)
    if (!order) {
        throw new ApiErrors(404, 'order is not found')
    }

    if (newStatus === 'Delivered') {
        order.isDelivered = true
        order.deliveredAt = Date.now()
    }
    order.status = newStatus

    try {
        await order.save()
    } catch (error) {
        throw new ApiErrors(500, 'order status update failed')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, order, 'order status updated successfully')
        )
})

export const deleteOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.body
    if (!orderId) {
        throw new ApiErrors(400, 'order id is required')
    }

    const order = Order.findById(orderId)
    if (!order) {
        throw new ApiErrors(404, 'order is not found')
    }

    try {
        await order.deleteOne()
    } catch (error) {
        throw new ApiErrors(500, 'order delete failed')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, orderId, 'order delete successfully')
        )
})