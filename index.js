import dotEnv from 'dotenv'
dotEnv.config()

import app from './src/app.js'
import connectDB from './src/db/database.js'
import serverless from 'serverless-http'

let isDbConnected = false
let dbConnectingPromise = null

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    if (!isDbConnected) {
      console.log('Connecting to Database...')
      if (!dbConnectingPromise) {
        dbConnectingPromise = connectDB()
      }
      await dbConnectingPromise
      isDbConnected = true
      console.log('Database Connected ✅')
    }
    next()
  } catch (err) {
    console.error('Database connection failed: ', err)
    return res.status(500).send('Database connection failed')
  }
})

// Basic route
app.get('/', (req, res) => {
  res.send('Shop Edge server is running ...')
})

// Local server test
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`)
  })
}

// Export for serverless (Vercel/AWS Lambda)
export default serverless(app)