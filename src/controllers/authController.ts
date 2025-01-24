import { Request, Response } from "express";
import userService from "../services/authServices";
import otpRepository from "../repositories/otpRepository";
import nodemailer from "nodemailer";
import userRepository from "../repositories/userRepository";

class AuthController {
    async userSignup(req: Request, res: Response) {
        try {
            const { name, email, phone, password } = req.body

            const signupResult = await userService.signupUser({ name, email, phone, password });

            if (!signupResult.success) {
                res.status(signupResult.status!).json({ message: signupResult.message });
                return
            }

            const otp = Math.floor(1000 + Math.random() * 9000)
            await otpRepository.saveOtp(email, otp)

            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_EMAIL_PASSWORD,
                },
            });

            await transporter.sendMail({
                to: email,
                from: process.env.USER_EMAIL,
                subject: "Imagebook OTP Verification",
                text: `Your OTP is: ${otp}`,
            });

            res.status(200).json({ success: true, message: "OTP sent to your email" })
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
        }
    }

    async userVerify(req: Request, res: Response) {
        try {
            const { email, otp } = req.body
            const savedOtp = await otpRepository.findOtpByEmail(email)

            if (savedOtp?.otp === parseInt(otp)) {
                await userService.verifyUser(email)
                res.status(200).json({ success: true, message: "User verified successfully" })
            } else {
                res.status(401).json({ message: "Incorrect OTP" })
            }
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
        }
    }

    async userSignin(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            const signinResult = await userService.signinUser(email, password)

            if (!signinResult.success) {
                res.status(signinResult.status!).json({ message: signinResult.message })
                return;
            }

            res.status(200).json({ success: true, token: signinResult.token })
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" })
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            const { email } = req.body;

            const user = await userRepository.findUserByEmail(email)
            if (!user) {
                res.status(404).json({ message: "User not found" })
                return;
            }

            const otp = Math.floor(1000 + Math.random() * 9000)
            await otpRepository.saveOtp(email, otp);

            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_EMAIL_PASSWORD,
                },
            });

            await transporter.sendMail({
                to: email,
                from: process.env.USER_EMAIL,
                subject: "Imagebook OTP Verification",
                text: `Your OTP is: ${otp}`,
            });

            res.status(200).json({ success: true, message: "OTP sent to your email" })
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" })
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const { email, newPassword } = req.body

            const changePasswordResult = await userService.changePassword(email, newPassword)

            if (!changePasswordResult.success) {
                res.status(changePasswordResult.status!).json({ message: changePasswordResult.message })
                return
            }

            res.status(200).json({ success: true, message: "Password updated successfully" })
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: "Internal server error" })
        }
    }
}

export default new AuthController()
