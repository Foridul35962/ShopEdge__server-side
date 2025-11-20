import express from 'express'
import * as adminController from '../controllers/admin.controller.js'
import verifyJWT from '../middlewares/VerifyJWT.js'
import checkAdmin from '../middlewares/checkAdmin.js'

const admin = express.Router()

admin.get('/get-users', verifyJWT, checkAdmin, adminController.getUsers)
admin.post('/add-admin', verifyJWT, checkAdmin, adminController.addAdmin)
admin.patch('/change-role', verifyJWT, checkAdmin, adminController.changeRole)
admin.delete('/delete-user', verifyJWT, checkAdmin, adminController.deleteUser)

export default admin