import mongoose from "mongoose";

const connectDB = async ()=>{
    await mongoose.connect(`${process.env.MONGODB_URL}/shopedge`).then(()=>{
        console.log('Database is connected');
    }).catch((err)=>{
        throw err
    })
}

export default connectDB