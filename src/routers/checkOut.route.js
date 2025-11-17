import express from 'express'
import * as checkOutController from '../controllers/checkOut.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'

const CheckOut = express.Router()

CheckOut.post('/add', verifyJWT, checkOutController.addCheckOut)
CheckOut.patch('/:_id/pay', verifyJWT, checkOutController.onlinePayment)

export default CheckOut