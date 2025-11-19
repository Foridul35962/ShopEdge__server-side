import express from 'express'
import * as subscriberController from '../controllers/subscriber.controller.js'

const Subscriber = express.Router()

Subscriber.post('/add', subscriberController.addSubscriber)

export default Subscriber