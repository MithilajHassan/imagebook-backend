// controllers/imageController.ts
import { Request, Response } from 'express';
import { CustomRequest } from '../middlewares/auth';
import imageService from '../services/imageServices';

class ImageController {
    async createImage(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { title, imagePath, order } = req.body
            const newImage = await imageService.createImage(req.user?._id as string, title, imagePath, order);

            res.status(201).json({ message: 'Image created successfully', image: newImage })
        } catch (error) {
            res.status(500).json({ error: 'Failed to create image' })
        }
    }

    async findImagesByUserId(req: CustomRequest, res: Response): Promise<void> {
        try {
            const images = await imageService.getImagesByUserId(req.user?._id as string)
            res.status(200).json(images)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch images' })
        }
    }

    async updateImage(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const { title, imagePath } = req.body

            const updatedImage = await imageService.updateImage(id, { title, imagePath })

            if (!updatedImage) {
                res.status(404).json({ error: 'Image not found' })
                return
            }

            res.status(200).json({ message: 'Image updated successfully', image: updatedImage })
        } catch (error) {
            res.status(500).json({ error: 'Failed to update image' })
        }
    }

    async deleteImage(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params

            const deletedImage = await imageService.deleteImage(id)

            if (!deletedImage) {
                res.status(404).json({ error: 'Image not found' })
                return
            }

            res.status(200).json({ message: 'Image deleted successfully' })
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete image' })
        }
    }

    async updateImageOrder(req: Request, res: Response): Promise<void> {
        try {
            const { images } = req.body

            await imageService.updateImageOrder(images)
            res.status(200).json({ success: true, message: 'Order updated successfully' })
        } catch (error) {
            res.status(500).json({ error: 'Failed to update image order' })
        }
    }
}

export default new ImageController()
