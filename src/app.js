import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

//local module import
import userRouter from './routers/user.route.js'
import errorHandler from './utils/errorHandler.js'
import productRouter from './routers/product.route.js'
import CartRouter from './routers/Cart.route.js'
import CheckOutRouter from './routers/checkOut.route.js'

//setting request URL
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// sent and read cookies
app.use(cookieParser())

//public files
app.use(express.static('public'))

//setting for req.body
app.use(urlencoded({extended: false}))
app.use(express.json())

//routers
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/carts', CartRouter)
app.use('/api/v1/check-out', CheckOutRouter)

//is server working check
app.get('/', (req, res)=>{
    res.send('Shop Edge server is running ...')
})

//Global error handler
app.use(errorHandler)

export default app