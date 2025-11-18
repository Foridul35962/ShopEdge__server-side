import Cart from "../models/Cart.model.js";
import CheckOut from "../models/Checkout.model.js";
import Order from "../models/Order.model.js";
import ApiErrors from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addCheckOut = asyncHandler(async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body
    const userId = req.user?._id

    if (!checkoutItems || checkoutItems.length === 0) {
        throw new ApiErrors(400, 'no items in checkout')
    }

    const newCheckOut = await CheckOut.create({
        user: userId,
        checkOutItems: checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        paymentStatus: "Pending",
        isPaid: false
    })

    if (!newCheckOut) {
        throw new ApiErrors(500, 'new check out added failed')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, newCheckOut, 'new check out added successfully')
        )
})

export const onlinePayment = asyncHandler(async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body
    const { _id: checkOutId } = req.params

    if (!paymentStatus || !paymentDetails) {
        throw new ApiErrors(400, 'payment status and details both are required')
    }

    const checkOut = await CheckOut.findById(checkOutId)
    if (!checkOut) {
        throw new ApiErrors(400, 'checkout not found')
    }

    if (checkOut.isPaid) {
        throw new ApiErrors(400, "Payment already completed");
    }

    if (paymentStatus === 'Paid') {
        checkOut.isPaid = true
        checkOut.paymentStatus = paymentStatus
        checkOut.paymentDetails = paymentDetails
        checkOut.paidAt = Date.now()

        await checkOut.save()

        return res
            .status(200)
            .json(
                new ApiResponse(200, checkOut, 'payment updated successfully')
            )
    } else {
        throw new ApiErrors(400, 'Invalid payment status')
    }
})

export const finalize = asyncHandler(async(req, res)=>{
    const checkOutId = req.params?._id
    const checkOut = await CheckOut.findById(checkOutId)
    if (!checkOut) {
        throw new ApiErrors(404, 'check out not found')
    }
    if (checkOut.isPaid && !checkOut.isFinalized) {
        const finalOrder = await Order.create({
            user: checkOut.user,
            orderItems: checkOut.checkOutItems,
            shippingAddress: checkOut.shippingAddress,
            paymentMethod: checkOut.paymentMethod,
            totalPrice: checkOut.totalPrice,
            isPaid: true,
            paidAt: checkOut.paidAt,
            isDelivered: false,
            paymentStatus: "paid",
            paymentDetails: checkOut.paymentDetails
        })

        //Mark the checkout as finalized
        checkOut.isFinalized = true
        checkOut.finalizedAt = Date.now()
        await checkOut.save()

        //Delete the cart associated with the user
        await Cart.findOneAndDelete({user: checkOut.user})

        return res
            .status(201)
            .json(
                new ApiResponse(201, finalOrder, 'checkout finalized successfully')
            )
    } else {
        throw new ApiErrors(400, 'check out already finalized')
    }
})