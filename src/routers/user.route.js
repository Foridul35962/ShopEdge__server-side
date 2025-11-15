import express from 'express'
import * as userController from '../controllers/user.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'

const user = express.Router()

user.post('/register', userController.register)
user.post('/register-verify-email', userController.verifyEmail)
user.post('/login', userController.login)
user.get('/profile', verifyJWT, userController.profile)

export default user
