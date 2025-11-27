import dotEnv from 'dotenv'
dotEnv.config()
import app from './src/app.js'
import connectDB from './src/db/database.js'

// connectDB call
const PORT = process.env.PORT || 3000

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`server is running on http://localhost:${PORT}`);
    })
}).catch((error)=>{
    console.log('server connection failed: ',error);
})