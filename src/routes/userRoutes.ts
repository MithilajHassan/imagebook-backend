import { Router } from "express";
import authController from "../controllers/authController";


const userRoute = Router()

userRoute.post('/signin', authController.userSignin)
userRoute.post('/signup', authController.userSignup)
userRoute.post('/verifyuser', authController.userVerify)
userRoute.post('/resendotp', authController.resendOtp)
userRoute.post('/signout', authController.signout)
userRoute.post('/changepassword', authController.changePassword)

export default userRoute