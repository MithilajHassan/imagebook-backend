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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var userModel_1 = require("../models/userModel");
var bcrypt_1 = require("bcrypt");
var nodemailer_1 = require("nodemailer");
var otpModel_1 = require("../models/otpModel");
var jsonwebtoken_1 = require("jsonwebtoken");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.userSignup = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name_1, email, phone, password, user, otp, otpData, transporter, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, name_1 = _a.name, email = _a.email, phone = _a.phone, password = _a.password;
                        return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
                    case 1:
                        if (_b.sent()) {
                            res.status(409).json({ message: 'Email already exist' });
                            return [2 /*return*/];
                        }
                        user = new userModel_1.default({
                            name: name_1,
                            email: email,
                            phone: phone,
                            password: password
                        });
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _b.sent();
                        otp = Math.floor(1000 + Math.random() * 9000);
                        otpData = new otpModel_1.default({
                            email: email,
                            otp: otp,
                        });
                        return [4 /*yield*/, otpData.save()];
                    case 3:
                        _b.sent();
                        transporter = nodemailer_1.default.createTransport({
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
                            text: "Your OTP is: ".concat(otp)
                        });
                        res.status(200).json({ success: true, message: 'OTP sent to your email' });
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _b.sent();
                        res.status(500).json({ message: 'Internal server error !' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.userVerify = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, otp, savedOtp, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = req.body, email = _a.email, otp = _a.otp;
                        return [4 /*yield*/, otpModel_1.default.findOne({ email: email })];
                    case 1:
                        savedOtp = _b.sent();
                        if (!((savedOtp === null || savedOtp === void 0 ? void 0 : savedOtp.otp) == otp)) return [3 /*break*/, 3];
                        return [4 /*yield*/, userModel_1.default.findOneAndUpdate({ email: email }, { isVerified: true })];
                    case 2:
                        _b.sent();
                        res.status(200).json({ success: true });
                        return [2 /*return*/];
                    case 3:
                        res.status(401).json({ message: "Incorrect OTP" });
                        return [2 /*return*/];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_2 = _b.sent();
                        res.status(500).json({ message: 'Internal server error !' });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.userSignin = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, user, token, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            res.status(404).json({ message: "User not found." });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, (0, bcrypt_1.compare)(password, user.password)];
                    case 2:
                        if ((_b.sent()) && user.isVerified) {
                            token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '7d' });
                            res.cookie('jwt', token, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV == 'production',
                                // sameSite: 'none',
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                            });
                            res.status(200).json({ success: true, userData: user });
                            return [2 /*return*/];
                        }
                        else {
                            res.status(401).json({ message: "Wrong password" });
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _b.sent();
                        res.status(500).json({ message: 'Internal server error !' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.resendOtp = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, user, otp, otpData, transporter, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        email = req.body.email;
                        return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            res.status(404).json({ message: "User not found" });
                            return [2 /*return*/];
                        }
                        otp = Math.floor(1000 + Math.random() * 9000);
                        otpData = new otpModel_1.default({
                            email: email,
                            otp: otp,
                        });
                        return [4 /*yield*/, otpData.save()];
                    case 2:
                        _a.sent();
                        transporter = nodemailer_1.default.createTransport({
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
                            text: "Your OTP is: ".concat(otp)
                        });
                        res.status(200).json({ success: true, message: 'OTP sent to your email' });
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        res.status(500).json({ message: 'Internal server error !' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.signout = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    res.cookie('jwt', '', {
                        httpOnly: true,
                        secure: process.env.NODE_ENV == 'production',
                        // sameSite: 'none',
                        expires: new Date(0),
                    });
                    res.status(200).json({ message: "You are signed out", success: true });
                }
                catch (err) {
                    res.status(500).json({ message: 'Internal server error !' });
                }
                return [2 /*return*/];
            });
        });
    };
    AuthController.prototype.changePassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, newPassword, user, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, email = _a.email, newPassword = _a.newPassword;
                        return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            res.status(404).json({ success: false, message: "User not found." });
                            return [2 /*return*/];
                        }
                        user.password = newPassword;
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _b.sent();
                        res.status(200).json({ success: true, message: "Password updated successfully." });
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _b.sent();
                        res.status(500).json({ message: 'Internal server error !' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.default = new AuthController();
