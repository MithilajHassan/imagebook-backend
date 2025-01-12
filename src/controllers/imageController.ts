import { Request, Response } from 'express';
import Image, { IImage } from '../models/imageModel'
import { CustomRequest } from '../middlewares/auth';


export type ImageOrderUpdate = {
    _id: string;
    order: number;
}

class ImageController {

    async createImage(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { title, imagePath, order } = req.body;

            const newImage = new Image({ userId: req.user?._id, title, imagePath, order });
            await newImage.save();

            res.status(201).json({ message: 'Image created successfully', image: newImage });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create image' });
        }
    }

    async findImagesByUserId(req: CustomRequest, res: Response): Promise<void> {
        try {
            const images = await Image.find({ userId: req?.user?._id }).sort({ order: 1 });
            res.status(200).json(images);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch images' });
        }
    }


    async updateImage(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { title, imagePath } = req.body;
            let updatedImage
            if (imagePath) {
                updatedImage = await Image.findByIdAndUpdate(
                    id,
                    { title, imagePath },
                    { new: true }
                )
            } else {
                updatedImage = await Image.findByIdAndUpdate(
                    id,
                    { title },
                    { new: true }
                )
            }
            if (!updatedImage) {
                res.status(404).json({ error: 'Image data not found' })
                return;
            }
            res.status(200).json({ message: 'Image updated successfully', image: updatedImage })
        } catch (error) {
            res.status(500).json({ error: 'Failed to update image' })
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
            const { images }: { images: ImageOrderUpdate[] } = req.body

            const bulkOps = images.map((image) => ({
                updateOne: {
                    filter: { _id: image._id },
                    update: { order: image.order },
                },
            }))

            await Image.bulkWrite(bulkOps)

            res.status(200).json({ success: true, message: 'Updated successfully' })

        } catch (error) {
            console.error('Error: ', error);
            res.status(500).json({ error: 'Failed to update image order!!' })
        }
    }
}

export default new ImageController
