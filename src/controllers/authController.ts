import { Request, Response } from "express";
import User from "../models/userModel";
import { compare } from "bcrypt";
import nodemailer from 'nodemailer'
import Otp from "../models/otpModel";
import jwt from "jsonwebtoken"


class AuthController {

    async userSignup(req: Request, res: Response) {
        try {
            const { name, email, phone, password } = req.body
            if (await User.findOne({ email })) {
                res.status(409).json({ message: 'Email already exist' })
                return
            }
            const user = new User({
                name,
                email,
                phone,
                password
            })
            await user.save()
            const otp = Math.floor(1000 + Math.random() * 9000)
            const otpData = new Otp({
                email: email,
                otp: otp,
            })
            await otpData.save()
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                service: "Gmail",
                secure: true,
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_EMAIL_PASSWORD
                },
            })

            transporter.sendMail({
                to: email,
                from: process.env.USER_EMAIL,
                subject: "Imagebook OTP Verification",
                text: `Your OTP is: ${otp}`
            })

            res.status(200).json({ success: true, message: 'OTP sent to your email' })
        } catch (err) {
            res.status(500).json({ message: 'Internal server error !' })
        }
    }

    async userVerify(req: Request, res: Response) {
        try {
            const { email, otp } = req.body
            const savedOtp = await Otp.findOne({ email })
            if (savedOtp?.otp == otp) {
                await User.findOneAndUpdate({ email }, { isVerified: true })
                res.status(200).json({ success: true })
                return
            } else {
                res.status(401).json({ message: "Incorrect OTP" })
                return
            }
        } catch (err) {
            res.status(500).json({ message: 'Internal server error !' })
        }
    }


    async userSignin(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                res.status(404).json({ message: "User not found." })
                return
            }
            if (await compare(password, user.password) && user.isVerified) {
                const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET!, { expiresIn: '7d' })
                res.status(200).json({ success: true, token })
                return
            } else {
                res.status(401).json({ message: "Wrong password" })
                return
            }
        } catch (err) {
            res.status(500).json({ message: 'Internal server error !' })
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            const { email } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                res.status(404).json({ message: "User not found" })
                return
            }
            const otp = Math.floor(1000 + Math.random() * 9000)
            const otpData = new Otp({
                email: email,
                otp: otp,
            })
            await otpData.save()
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                service: "Gmail",
                secure: true,
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_EMAIL_PASSWORD
                },
            })

            transporter.sendMail({
                to: email,
                from: process.env.USER_EMAIL,
                subject: "Imagebook OTP Verification",
                text: `Your OTP is: ${otp}`
            })

            res.status(200).json({ success: true, message: 'OTP sent to your email' })
        } catch (err) {
            res.status(500).json({ message: 'Internal server error !' })
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const { email, newPassword } = req.body
            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json({ success: false, message: "User not found." })
                return 
            }
            user.password = newPassword
            await user.save()
            res.status(200).json({ success: true, message: "Password updated successfully." })
        } catch (err) {
            res.status(500).json({ message: 'Internal server error !' })
        }
    }

    

}

export default new AuthController()
