import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    }
}, {timestamps: true})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

userSchema.method.isPasswordCorrect = async (password)=>{
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

export default User