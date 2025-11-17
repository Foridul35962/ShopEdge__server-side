import express from 'express'
import * as cartController from '../controllers/cart.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'

const Cart = express.Router()

Cart.post('/add', verifyJWT, cartController.addCart)
Cart.patch('/update-quantity', verifyJWT, cartController.updateQuantity)
Cart.delete('/delete', verifyJWT, cartController.deleteCart)
Cart.get('/get', verifyJWT, cartController.getCart)


export default Cart