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