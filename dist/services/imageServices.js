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
const imageRepository_1 = __importDefault(require("../repositories/imageRepository"));
class ImageService {
    createImage(userId, title, imagePath, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imageRepository_1.default.createImage({ userId, title, imagePath, order });
        });
    }
    getImagesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imageRepository_1.default.findImagesByUserId(userId);
        });
    }
    updateImage(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imageRepository_1.default.updateImageById(id, updateData);
        });
    }
    deleteImage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imageRepository_1.default.deleteImageById(id);
        });
    }
    updateImageOrder(images) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imageRepository_1.default.updateImageOrder(images);
        });
    }
}
exports.default = new ImageService;
