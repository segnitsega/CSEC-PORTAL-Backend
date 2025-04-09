import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken"


const secretKey = process.env.SECRET_KEY || ""

interface authenticatedRequest extends Request {
    user ?: string | JwtPayload
}

export const authenticateToken = (req: authenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.body.token || req.headers['authorization']?.split(' ')[1];

    if(!token){
        return res.status(401).json({message: "No authentication token provided"})
    }

    jwt.verify(token, secretKey, (error: VerifyErrors | null, user: string | JwtPayload | undefined) => {
        if(error){
            return res.status(403).json({message: "Invalid token."})
        }
        req.user = user 
        next() 
    })
} 