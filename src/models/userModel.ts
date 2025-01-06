import { Document, model, Schema } from "mongoose"
import bcrypt from 'bcrypt'

export interface IUser extends Document {
    name: string,
    email: string,
    phone: number,
    password: string,
    isVerified: boolean
}

const userSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }
})
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = model<IUser>('User', userSchema)

export default User