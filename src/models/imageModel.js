"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var imageSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    imagePath: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
}, { timestamps: true });
var Image = (0, mongoose_1.model)('Image', imageSchema);
exports.default = Image;
