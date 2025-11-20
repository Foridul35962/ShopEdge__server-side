import express from 'express'
import * as adminController from '../controllers/admin.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'
import checkAdmin from '../middlewares/checkAdmin.js'

const admin = express.Router()

admin.get('/get-users', verifyJWT, checkAdmin, adminController.getUsers)
admin.post('/add-admin', verifyJWT, checkAdmin, adminController.addAdmin)

export default admin