import express from 'express'
import * as orderController from '../controllers/order.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'

const order = express.Router()

order.get('/my-orders', verifyJWT, orderController.getOrder)
order.get('/order-details/:_id', verifyJWT, orderController.getOrderDetails)

export default order