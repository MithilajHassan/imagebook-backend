"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var otpSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, expires: '60s' }
});
var Otp = (0, mongoose_1.model)('Otp', otpSchema);
exports.default = Otp;
