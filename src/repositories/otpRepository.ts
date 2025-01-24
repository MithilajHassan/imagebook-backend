import Otp from "../models/otpModel";

class OtpRepository {
    async findOtpByEmail(email: string) {
        return Otp.findOne({ email });
    }

    async saveOtp(email: string, otp: number) {
        const otpData = new Otp({ email, otp })
        return otpData.save()
    }
}

export default new OtpRepository
