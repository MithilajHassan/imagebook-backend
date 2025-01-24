import imageRepository from '../repositories/imageRepository';

class ImageService {

    async createImage(userId: string, title: string, imagePath: string, order: number) {
        return await imageRepository.createImage({ userId, title, imagePath, order })
    }

    async getImagesByUserId(userId: string) {
        return await imageRepository.findImagesByUserId(userId)
    }

    async updateImage(id: string, updateData: { title?: string; imagePath?: string }) {
        return await imageRepository.updateImageById(id, updateData)
    }

    async deleteImage(id: string) {
        return await imageRepository.deleteImageById(id)
    }

    async updateImageOrder(images: { _id: string; order: number }[]) {
        return await imageRepository.updateImageOrder(images)
    }
}

export default new ImageService