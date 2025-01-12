"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = require("bcrypt");
const nodemailer_1 = __importDefault(require("nodemailer"));
const otpModel_1 = __importDefault(require("../models/otpModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    userSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, password } = req.body;
                if (yield userModel_1.default.findOne({ email })) {
                    res.status(409).json({ message: 'Email already exist' });
                    return;
                }
                const user = new userModel_1.default({
                    name,
                    email,
                    phone,
                    password
                });
                yield user.save();
                const otp = Math.floor(1000 + Math.random() * 9000);
                const otpData = new otpModel_1.default({
                    email: email,
                    otp: otp,
                });
                yield otpData.save();
                const transporter = nodemailer_1.default.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    service: "Gmail",
                    secure: true,
                    auth: {
                        user: process.env.USER_EMAIL,
                        pass: process.env.USER_EMAIL_PASSWORD
                    },
                });
                transporter.sendMail({
                    to: email,
                    from: process.env.USER_EMAIL,
                    subject: "Imagebook OTP Verification",
                    text: `Your OTP is: ${otp}`
                });
                res.status(200).json({ success: true, message: 'OTP sent to your email' });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error !' });
            }
        });
    }
    userVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const savedOtp = yield otpModel_1.default.findOne({ email });
                if ((savedOtp === null || savedOtp === void 0 ? void 0 : savedOtp.otp) == otp) {
                    yield userModel_1.default.findOneAndUpdate({ email }, { isVerified: true });
                    res.status(200).json({ success: true });
                    return;
                }
                else {
                    res.status(401).json({ message: "Incorrect OTP" });
                    return;
                }
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error !' });
            }
        });
    }
    userSignin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    res.status(404).json({ message: "User not found." });
                    return;
                }
                if ((yield (0, bcrypt_1.compare)(password, user.password)) && user.isVerified) {
                    const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '7d' });
                    res.status(200).json({ success: true, token });
                    return;
                }
                else {
                    res.status(401).json({ message: "Wrong password" });
                    return;
                }
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error !' });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }
                const otp = Math.floor(1000 + Math.random() * 9000);
                const otpData = new otpModel_1.default({
                    email: email,
                    otp: otp,
                });
                yield otpData.save();
                const transporter = nodemailer_1.default.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    service: "Gmail",
                    secure: true,
                    auth: {
                        user: process.env.USER_EMAIL,
                        pass: process.env.USER_EMAIL_PASSWORD
                    },
                });
                transporter.sendMail({
                    to: email,
                    from: process.env.USER_EMAIL,
                    subject: "Imagebook OTP Verification",
                    text: `Your OTP is: ${otp}`
                });
                res.status(200).json({ success: true, message: 'OTP sent to your email' });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error !' });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newPassword } = req.body;
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    res.status(404).json({ success: false, message: "User not found." });
                    return;
                }
                user.password = newPassword;
                yield user.save();
                res.status(200).json({ success: true, message: "Password updated successfully." });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error !' });
            }
        });
    }
}
exports.default = new AuthController();
