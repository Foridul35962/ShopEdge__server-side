import dotEnv from 'dotenv'
dotEnv.config()
import app from './src/app.js'
import connectDB from './src/db/database.js'
import serverless from 'serverless-http'
export default serverless(app)

// connectDB call
connectDB().then(() => {
    console.log('Database connected successfully');
}).catch((error) => {
    console.log('Database connection failed: ', error);
})
