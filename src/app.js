import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

//local module import


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

////Global error handler

export default app