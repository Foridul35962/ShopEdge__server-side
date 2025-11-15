import express from 'express'
import * as productController from '../controllers/product.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'
import checkAdmin from '../middlewares/checkAdmin.js'

const product = express.Router()

product.post('/add-product', verifyJWT, checkAdmin, productController.addProduct)
product.put('/update-product/:_id', verifyJWT, checkAdmin, productController.updateProduct)


export default product