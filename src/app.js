import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

//local module import
import userRouter from './routers/user.route.js'
import errorHandler from './utils/errorHandler.js'

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

//is server working check
app.use('/', (req, res)=>{
    res.send('Shop Edge server is running ...')
})

//routers
app.use('/api/v1/users', userRouter)

//Global error handler
app.use(errorHandler)

export default app