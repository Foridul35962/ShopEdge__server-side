import express from 'express'
import * as checkOutController from '../controllers/checkOut.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'

const CheckOut = express.Router()

CheckOut.post('/add', verifyJWT, checkOutController.addCheckOut)
CheckOut.patch('/:_id/pay', verifyJWT, checkOutController.onlinePayment)
CheckOut.post('/:_id/finalize', verifyJWT, checkOutController.finalize)


export default CheckOut