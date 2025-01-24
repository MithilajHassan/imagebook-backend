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
const imageServices_1 = __importDefault(require("../services/imageServices"));
class ImageController {
    createImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { title, imagePath, order } = req.body;
                const newImage = yield imageServices_1.default.createImage((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, title, imagePath, order);
                res.status(201).json({ message: 'Image created successfully', image: newImage });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create image' });
            }
        });
    }
    findImagesByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const images = yield imageServices_1.default.getImagesByUserId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
                res.status(200).json(images);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch images' });
            }
        });
    }
    updateImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { title, imagePath } = req.body;
                const updatedImage = yield imageServices_1.default.updateImage(id, { title, imagePath });
                if (!updatedImage) {
                    res.status(404).json({ error: 'Image not found' });
                    return;
                }
                res.status(200).json({ message: 'Image updated successfully', image: updatedImage });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update image' });
            }
        });
    }
    deleteImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deletedImage = yield imageServices_1.default.deleteImage(id);
                if (!deletedImage) {
                    res.status(404).json({ error: 'Image not found' });
                    return;
                }
                res.status(200).json({ message: 'Image deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete image' });
            }
        });
    }
    updateImageOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { images } = req.body;
                yield imageServices_1.default.updateImageOrder(images);
                res.status(200).json({ success: true, message: 'Order updated successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update image order' });
            }
        });
    }
}
exports.default = new ImageController();
