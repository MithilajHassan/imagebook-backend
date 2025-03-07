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
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    signupUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield userRepository_1.default.findUserByEmail(userData.email);
            if (existingUser) {
                return { success: false, status: 409, message: "Email already exists" };
            }
            yield userRepository_1.default.createUser(userData);
            return { success: true };
        });
    }
    signinUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository_1.default.findUserByEmail(email);
            if (!user) {
                return { success: false, status: 404, message: "User not found." };
            }
            if ((yield (0, bcrypt_1.compare)(password, user.password)) && user.isVerified) {
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: "7d" });
                return { success: true, token };
            }
            return { success: false, status: 401, message: "Wrong password or user not verified" };
        });
    }
    verifyUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userRepository_1.default.verifyUser(email);
        });
    }
    changePassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository_1.default.findUserByEmail(email);
            if (!user) {
                return { success: false, status: 404, message: "User not found." };
            }
            yield userRepository_1.default.updatePassword(email, newPassword);
            return { success: true };
        });
    }
}
exports.default = new UserService;
