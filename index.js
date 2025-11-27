import dotEnv from 'dotenv'
import app from './src/app.js'
import connectDB from './src/db/database.js'
import serverless from 'serverless-http'
dotEnv.config()

const PORT = process.env.PORT || 3000

const handler = serverless(app);

export default async (req, res) => {
    await connectDB();
    return handler(req, res);
};

if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running locally on http://localhost:${PORT}`);
        })
    }).catch((error) => {
        console.log('Server connection failed: ', error);
    })
}