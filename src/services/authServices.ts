import userRepository from "../repositories/userRepository";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {

    async signupUser(userData: { name: string; email: string; phone: string; password: string }) {
        const existingUser = await userRepository.findUserByEmail(userData.email)
        if (existingUser) {
            return { success: false, status: 409, message: "Email already exists" }
        }
        await userRepository.createUser(userData)
        return { success: true }
    }

    async signinUser(email: string, password: string) {
        const user = await userRepository.findUserByEmail(email)
        if (!user) {
            return { success: false, status: 404, message: "User not found." }
        }
        if (await compare(password, user.password) && user.isVerified) {
            const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET!, { expiresIn: "7d" })
            return { success: true, token }
        }
        return { success: false, status: 401, message: "Wrong password or user not verified" }
    }

    async verifyUser(email: string) {
        await userRepository.verifyUser(email)
    }

    async changePassword(email: string, newPassword: string) {
        const user = await userRepository.findUserByEmail(email)
        if (!user) {
            return { success: false, status: 404, message: "User not found." }
        }
        const salt = await genSalt(10)
        const hashedPassword = await hash(newPassword, salt)
        await userRepository.updatePassword(email, hashedPassword)
        return { success: true }
    }
}

export default new UserService
