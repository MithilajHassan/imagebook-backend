"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    imagePath: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
}, { timestamps: true });
const Image = (0, mongoose_1.model)('Image', imageSchema);
exports.default = Image;
