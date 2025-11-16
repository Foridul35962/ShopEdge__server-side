import express from 'express'
import * as productController from '../controllers/product.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'
import checkAdmin from '../middlewares/checkAdmin.js'

const product = express.Router()

product.post('/add-product', verifyJWT, checkAdmin, productController.addProduct)
product.patch('/update-product/:_id', verifyJWT, checkAdmin, productController.updateProduct)
product.post('/delete-product', verifyJWT, checkAdmin, productController.deleteProduct)
product.get('/all', productController.getProduct)
product.get('/id/:_id', productController.getProductById)
product.get('/similar-product/:_id', productController.similarProduct)


export default product