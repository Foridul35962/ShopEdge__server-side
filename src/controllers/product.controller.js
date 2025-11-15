import Products from "../models/Product.model.js";
import ApiErrors from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        discountPrice,
        countInStock,
        sku,
        category,
        brand,
        sizes,
        color,
        collections,
        material,
        gender,
        images,
        tags
    } = req.body

    try {
        const product = new Products({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            sizes,
            color,
            collections,
            material,
            gender,
            images,
            tags,
            user: req.user._id
        })
    
        await product.save()

        return res
            .status(200)
            .json(
                new ApiResponse(200, product, 'product save successfully')
            )
    } catch (error) {
        throw new ApiErrors(400, "product save failed")
    }
})