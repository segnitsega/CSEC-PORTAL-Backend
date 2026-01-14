import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken"
import { config } from "../config";
import { AuthUser } from "../types/express";

const secretKey = config.SECRET_KEY

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token){
        res.status(401).json({message: "No authentication token provided"})
        return
    }

    jwt.verify(token, secretKey, (error: VerifyErrors | null, user: string | JwtPayload | undefined) => {
        if(error){
            return res.status(403).json({message: "Invalid token"})
        }
        req.user = user as AuthUser
        next()
    })
}
