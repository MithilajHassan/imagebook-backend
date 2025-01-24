import Image from '../models/imageModel';

class ImageRepository {
    
    async createImage(imageData: { userId: string; title: string; imagePath: string; order: number }) {
        const newImage = new Image(imageData)
        return await newImage.save()
    }

    async findImagesByUserId(userId: string) {
        return await Image.find({ userId }).sort({ order: 1 })
    }

    async updateImageById(id: string, updateData: { title?: string; imagePath?: string }) {
        return await Image.findByIdAndUpdate(id, updateData, { new: true })
    }

    async deleteImageById(id: string) {
        return await Image.findByIdAndDelete(id)
    }

    async updateImageOrder(images: { _id: string; order: number }[]) {
        const bulkOps = images.map((image) => ({
            updateOne: {
                filter: { _id: image._id },
                update: { order: image.order },
            },
        }))
        return await Image.bulkWrite(bulkOps)
    }
}

export default new ImageRepository
