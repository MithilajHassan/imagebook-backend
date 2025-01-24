import User from "../models/userModel";

class UserRepository {
    async findUserByEmail(email: string) {
        return User.findOne({ email })
    }

    async createUser(userData: { name: string; email: string; phone: string; password: string }) {
        const user = new User(userData)
        return user.save()
    }

    async verifyUser(email: string) {
        return User.findOneAndUpdate({ email }, { isVerified: true })
    }

    async updatePassword(email: string, password: string) {
        return User.findOneAndUpdate({ email }, { password })
    }
}

export default new UserRepository
