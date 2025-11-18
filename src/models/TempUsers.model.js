import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    expiredOtp:{
        type: Date,
        required: true
    },
    isverified:{
        type: Boolean,
        default: false
    },
    createdAt:{     //auto delete in 1 day
        type: Date,
        default: Date.now,
        expires: 86400
    }
})

export const TempUsers = mongoose.model('TempUsers', tempUserSchema)