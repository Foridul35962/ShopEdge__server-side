import express from 'express'
import * as productController from '../controllers/product.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'
import checkAdmin from '../middlewares/checkAdmin.js'
import upload from '../middlewares/upload.js'

const product = express.Router()

product.post('/add-product', verifyJWT, checkAdmin, upload, productController.addProduct)
product.patch('/update-product/:_id', verifyJWT, checkAdmin, upload, productController.updateProduct)
product.post('/delete-product', verifyJWT, checkAdmin, productController.deleteProduct)
product.get('/all', productController.getProduct)
product.get('/id/:_id', productController.getProductById)
product.get('/similar-product/:_id', productController.similarProduct)
product.get('/best-seller', productController.bestSellerProduct)
product.get('/new-arrivals', productController.newArrivals)


export default product