import Cart from "../models/Cart.model.js";
import Products from "../models/Product.model.js";
import ApiErrors from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addCart = asyncHandler(async (req, res) => {
    const { productId, quantity, size, color } = req.body
    const userId = req.user?._id

    const product = await Products.findById(productId)
    if (!product) {
        throw new ApiErrors(404, 'product not found')
    }

    const cart = await Cart.findOne({ user: userId })

    if (cart) {
        const productIdx = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        )
        if (productIdx > -1) {
            //If the product already exists, update the quantity
            cart.products[productIdx].quantity += quantity
        } else {
            //add new product
            cart.products.push({
                productId,
                name: product.name,
                image: product.images[0].url,
                price: product.price,
                size,
                color,
                quantity
            })
        }
        //Recalculate the total price
        cart.totalPrice = cart.products.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        )
        await cart.save()

        return res
            .status(200)
            .json(
                new ApiResponse(200, cart, 'cart updated successfully')
            )
    } else {
        // create a new cart for the guest or user
        const newCart = await Cart.create({
            user: userId,
            products: [
                {
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity
                }
            ],
            totalPrice: product.price * quantity
        })

        if (!newCart) {
            throw new ApiErrors(500, 'cart added failed')
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, newCart, 'cart added successfully')
            )
    }
})

export const updateQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity, size, color } = req.body
    const userId = req.user?._id

    if (quantity < 1) {
        throw new ApiErrors(400, 'user entered genetive quantity')
    }

    const product = await Products.findById(productId)
    if (!product) {
        throw new ApiErrors(404, 'product not found')
    }

    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
        throw new ApiErrors(400, 'user has no cart')
    }

    const productIdx = cart.products.findIndex(
        (p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
    )

    if (productIdx < 0) {
        throw new ApiErrors(404, 'product in cart not found')
    }

    cart.products[productIdx].quantity = quantity
    cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    )

    await cart.save()
    return res
        .status(200)
        .json(
            new ApiResponse(200, cart, "cart in product quantity updated successfully")
        )
})

export const deleteCart = asyncHandler(async (req, res) => {
    const { productId, size, color } = req.body
    const userId = req.user?._id

    if (!productId) {
        throw new ApiErrors(400, 'product id is required')
    }

    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
        throw new ApiErrors(404, 'user has no cart')
    }

    const productIdx = cart.products.findIndex(
        (p) => p.productId.toString() === productId &&
            p.color === color &&
            p.size === size
    )

    if (productIdx < 0) {
        throw new ApiErrors(400, 'user has not its product in his cart')
    }

    //calculate new total product price
    cart.totalPrice -= cart.products[productIdx].price * cart.products[productIdx].quantity

    //delete product in cart
    cart.products.splice(productIdx, 1)

    try {
        await cart.save()

        return res
            .status(200)
            .json(
                new ApiResponse(200, productId, 'product in cart deleted successfully')
            )
    } catch (error) {
        throw new ApiErrors(500, 'product in cart deleted failed', error)
    }
})

export const getCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
        throw new ApiErrors(404, 'user has no cart')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, cart, 'cart fetched successfully')
        )
})