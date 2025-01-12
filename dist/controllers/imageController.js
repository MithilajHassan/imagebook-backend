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
class ImageController {
    createImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { title, imagePath, order } = req.body;
                const newImage = new imageModel_1.default({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, title, imagePath, order });
                yield newImage.save();
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
                const images = yield imageModel_1.default.find({ userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id }).sort({ order: 1 });
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
                let updatedImage;
                if (imagePath) {
                    updatedImage = yield imageModel_1.default.findByIdAndUpdate(id, { title, imagePath }, { new: true });
                }
                else {
                    updatedImage = yield imageModel_1.default.findByIdAndUpdate(id, { title }, { new: true });
                }
                if (!updatedImage) {
                    res.status(404).json({ error: 'Image data not found' });
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
                const deletedImage = yield imageModel_1.default.findByIdAndDelete(id);
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
                const bulkOps = images.map((image) => ({
                    updateOne: {
                        filter: { _id: image._id },
                        update: { order: image.order },
                    },
                }));
                yield imageModel_1.default.bulkWrite(bulkOps);
                res.status(200).json({ success: true, message: 'Updated successfully' });
            }
            catch (error) {
                console.error('Error: ', error);
                res.status(500).json({ error: 'Failed to update image order!!' });
            }
        });
    }
}
exports.default = new ImageController;
