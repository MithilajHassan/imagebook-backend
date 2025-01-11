import { Request, Response } from 'express';
import Image from '../models/imageModel'
import { CustomRequest } from '../middlewares/auth';

class ImageController {

    async createImage(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { title, imagePath, order } = req.body;

            const newImage = new Image({ userId:req.user?._id, title, imagePath, order });
            await newImage.save();

            res.status(201).json({ message: 'Image created successfully', image: newImage });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create image' });
        }
    }

    async findImagesByUserId(req: CustomRequest, res: Response): Promise<void> {
        try {
            const images = await Image.find({userId:req?.user?._id}).sort({ order: 1 });
            res.status(200).json(images);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch images' });
        }
    }

    
    async updateImage(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { title, imagePath } = req.body;

            const updatedImage = await Image.findByIdAndUpdate(
                id,
                { title, imagePath },
                { new: true }
            );

            if (!updatedImage) {
                res.status(404).json({ error: 'Image not found' });
                return;
            }

            res.status(200).json({ message: 'Image updated successfully', image: updatedImage });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update image' });
        }
    }

    
    async deleteImage(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const deletedImage = await Image.findByIdAndDelete(id)

            if (!deletedImage) {
                res.status(404).json({ error: 'Image not found' })
                return;
            }

            res.status(200).json({ message: 'Image deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete image' });
        }
    }

    
    async updateImageOrder(req: Request, res: Response): Promise<void> {
        try {
            const { imageOrder } = req.body; 

           

            res.status(200).json({ message: 'Image order updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update image order' });
        }
    }
}

export default new ImageController;
