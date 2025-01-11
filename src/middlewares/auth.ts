import jwt from "jsonwebtoken"
import User, { IUser } from "../models/userModel"
import { NextFunction, Request, Response } from "express"

export interface CustomRequest extends Request {
    user?: IUser;
}
export interface JwtPayload {
    userId: string;
}

export const userProtect = async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token = req.cookies?.jwt
    if (token) {
        try {
            const decoded = jwt.verify(token,process.env.TOKEN_SECRET!) as JwtPayload
            const user = await User.findById(decoded.userId)
            if (!user) {
                res.status(401).json({ message: 'Not authorized, invalid token' })
                return 
            } 
            req.user = user
            next()
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' })
        return
    }
}