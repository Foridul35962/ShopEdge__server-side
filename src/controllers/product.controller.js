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
        colors,
        collections,
        material,
        gender,
        images,
        tags
    } = req.body

    if (
        !name ||
        !description ||
        !price ||
        !countInStock ||
        !sku ||
        !category ||
        !Array.isArray(sizes) || sizes.length === 0 ||
        !Array.isArray(colors) || colors.length === 0 ||
        !collections ||
        !Array.isArray(images) || images.length === 0
    ) {
        throw new ApiErrors(400, "All field are required")
    }

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
            colors,
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

export const updateProduct = asyncHandler(async (req, res) => {
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
        colors,
        collections,
        material,
        gender,
        images,
        tags,
        isFeatured,
        isPublished,
    } = req.body

    const { _id: productId } = req.params
    const product = await Products.findById(productId)
    if (!product) {
        throw new ApiErrors(404, "product not found")
    }

    product.name = name || product.name
    product.description = description || product.description
    product.price = price || product.price
    product.discountPrice = discountPrice || product.discountPrice
    product.countInStock = countInStock || product.countInStock
    product.category = category || product.category
    product.brand = brand || product.brand
    product.sizes = sizes || product.sizes
    product.colors = colors || product.colors
    product.collections = collections || product.collections
    product.material = material || product.material
    product.gender = gender || product.gender
    product.images = images || product.images
    product.tags = tags || product.tags
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured
    product.isPublished = isPublished !== undefined ? isPublished : product.isPublished
    product.sku = sku || product.sku

    const updatedProduct = await product.save()
    if (!updatedProduct) {
        throw new ApiErrors(500, "Product updated failed")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedProduct, "product updated successfully")
        )
})

export const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.body
    try {
        await Products.findByIdAndDelete(productId)
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, 'Product delete successfully')
            )
    } catch (error) {
        throw new ApiErrors(400, 'Entered wrong product id')
    }
})

export const getProduct = asyncHandler(async (req, res) => {
    const {
        collections,
        sizes,
        colors,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit
    } = req.query
    let query = {}

    if (collections && collections.toLocaleLowerCase() !== 'all') {
        query.collections = collections
    }
    if (category && category.toLocaleLowerCase() !== 'all') {
        query.category = category
    }
    if (material) {
        query.material = { $in: material.split(",") }
    }
    if (brand) {
        query.brand = { $in: brand.split(",") }
    }
    if (sizes) {
        query.sizes = { $in: sizes.split(",") }
    }
    if (colors) {
        query.colors = { $in: [colors] }
    }
    if (gender) {
        query.gender = gender
    }
    if (minPrice || maxPrice) {
        query.price = {}
        if (minPrice) {
            query.price.$gte = Number(minPrice)
        }
        if (maxPrice) {
            query.price.$lte = Number(maxPrice)
        }
    }
    if (search) {
        query.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            },
        ]
    }
    let sort = {}
    if (sortBy) {
        switch (sortBy) {
            case "priceAsc":
                sort = { price: 1 }
                break
            case "priceDesc":
                sort = { price: -1 }
                break
            case "popularity":
                sort = { rating: -1 }
                break
            default:
                break
        }
    }
    let products = await Products.find(query)
        .sort(sort)
        .limit(Number(limit) || 0)

    if (!products) {
        throw new ApiErrors(404, "product not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, products, "product fecthed successfully")
        )
})

export const getProductById = asyncHandler(async (req, res) => {
    const { _id: productId } = req.params
    const product = await Products.findById(productId)
    if (!product) {
        throw new ApiErrors(404, 'product not found')
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, product, 'product fetched successfully')
        )
})

export const similarProduct = asyncHandler(async (req, res) => {
    const {_id: productId} = req.params
    const product = await Products.findById(productId)
    if (!product) {
        throw new ApiErrors(404, "product is not found")
    }

    const similarProduct = await Products.find({
        _id:{$ne: productId},   //exclude the currect product
        gender: product.gender,
        category: product.category
    }).limit(4)
    if (!similarProduct) {
        throw new ApiErrors(404, 'similar product not found')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, similarProduct, 'similar product fetched successfully')
        )
})