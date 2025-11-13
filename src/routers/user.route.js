import express from 'express'
import * as userController from '../controllers/user.controller.js'

const user = express.Router()

user.post('/register', userController.register)

export default user
