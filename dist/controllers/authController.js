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
const authServices_1 = __importDefault(require("../services/authServices"));
const otpRepository_1 = __importDefault(require("../repositories/otpRepository"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
class AuthController {
    userSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, password } = req.body;
                const signupResult = yield authServices_1.default.signupUser({ name, email, phone, password });
                if (!signupResult.success) {
                    res.status(signupResult.status).json({ message: signupResult.message });
                    return;
                }
                const otp = Math.floor(1000 + Math.random() * 9000);
                yield otpRepository_1.default.saveOtp(email, otp);
                const transporter = nodemailer_1.default.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.USER_EMAIL,
                        pass: process.env.USER_EMAIL_PASSWORD,
                    },
                });
                yield transporter.sendMail({
                    to: email,
                    from: process.env.USER_EMAIL,
                    subject: "Imagebook OTP Verification",
                    text: `Your OTP is: ${otp}`,
                });
                res.status(200).json({ success: true, message: "OTP sent to your email" });
            }
            catch (err) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    userVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const savedOtp = yield otpRepository_1.default.findOtpByEmail(email);
                if ((savedOtp === null || savedOtp === void 0 ? void 0 : savedOtp.otp) === parseInt(otp)) {
                    yield authServices_1.default.verifyUser(email);
                    res.status(200).json({ success: true, message: "User verified successfully" });
                }
                else {
                    res.status(401).json({ message: "Incorrect OTP" });
                }
            }
            catch (err) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    userSignin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const signinResult = yield authServices_1.default.signinUser(email, password);
                if (!signinResult.success) {
                    res.status(signinResult.status).json({ message: signinResult.message });
                    return;
                }
                res.status(200).json({ success: true, token: signinResult.token });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield userRepository_1.default.findUserByEmail(email);
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }
                const otp = Math.floor(1000 + Math.random() * 9000);
                yield otpRepository_1.default.saveOtp(email, otp);
                const transporter = nodemailer_1.default.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.USER_EMAIL,
                        pass: process.env.USER_EMAIL_PASSWORD,
                    },
                });
                yield transporter.sendMail({
                    to: email,
                    from: process.env.USER_EMAIL,
                    subject: "Imagebook OTP Verification",
                    text: `Your OTP is: ${otp}`,
                });
                res.status(200).json({ success: true, message: "OTP sent to your email" });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newPassword } = req.body;
                const changePasswordResult = yield authServices_1.default.changePassword(email, newPassword);
                if (!changePasswordResult.success) {
                    res.status(changePasswordResult.status).json({ message: changePasswordResult.message });
                    return;
                }
                res.status(200).json({ success: true, message: "Password updated successfully" });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}
exports.default = new AuthController();
