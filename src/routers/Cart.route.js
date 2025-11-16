import express from 'express'
import * as cartController from '../controllers/cart.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'

const Cart = express.Router()

Cart.post('/add-cart', verifyJWT, cartController.addCart)

export default Cart