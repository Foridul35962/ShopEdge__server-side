import express from 'express'
import * as orderController from '../controllers/order.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'
import checkAdmin from '../middlewares/checkAdmin.js'

const order = express.Router()

order.get('/my-orders', verifyJWT, orderController.getOrder)
order.get('/order-details/:_id', verifyJWT, orderController.getOrderDetails)
order.get('/admin-orders-list', verifyJWT, checkAdmin, orderController.adminOrderList)
order.patch('/change-order-status', verifyJWT, checkAdmin, orderController.changeOrderStatus)
order.delete('/delete-order', verifyJWT, checkAdmin, orderController.deleteOrder)

export default order