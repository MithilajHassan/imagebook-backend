import { Router } from "express";
import authController from "../controllers/authController";
import imageController from "../controllers/imageController";
import { userProtect } from "../middlewares/auth";


const userRoute = Router()

userRoute.post('/signin', authController.userSignin)
userRoute.post('/signup', authController.userSignup)
userRoute.post('/verifyuser', authController.userVerify)
userRoute.post('/resendotp', authController.resendOtp)
userRoute.post('/signout', authController.signout)
userRoute.post('/changepassword', authController.changePassword)

userRoute.post('/images', userProtect, imageController.createImage)
userRoute.get('/images', userProtect, imageController.findImagesByUserId)
userRoute.put('/images/:id', userProtect, imageController.updateImage)
userRoute.delete('/images/:id', userProtect, imageController.deleteImage)
userRoute.patch('/images/order', userProtect, imageController.updateImageOrder)

export default userRoute