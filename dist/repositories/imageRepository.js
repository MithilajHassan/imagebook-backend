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
const imageModel_1 = __importDefault(require("../models/imageModel"));
class ImageRepository {
    createImage(imageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newImage = new imageModel_1.default(imageData);
            return yield newImage.save();
        });
    }
    findImagesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imageModel_1.default.find({ userId }).sort({ order: 1 });
        });
    }
    updateImageById(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imageModel_1.default.findByIdAndUpdate(id, updateData, { new: true });
        });
    }
    deleteImageById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imageModel_1.default.findByIdAndDelete(id);
        });
    }
    updateImageOrder(images) {
        return __awaiter(this, void 0, void 0, function* () {
            const bulkOps = images.map((image) => ({
                updateOne: {
                    filter: { _id: image._id },
                    update: { order: image.order },
                },
            }));
            return yield imageModel_1.default.bulkWrite(bulkOps);
        });
    }
}
exports.default = new ImageRepository;
