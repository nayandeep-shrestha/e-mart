import { Request, Response, NextFunction } from "express"
import { PrismaClient } from '@prisma/client'
import HttpException from "../models/http-exception.model"
export const prisma = new PrismaClient()
// const JWT = require('jsonwebtoken')
import JWT, { VerifyErrors, JwtPayload} from 'jsonwebtoken';

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined = req.headers['authorization']
        if (!token) {
            throw new HttpException(401,"Authorization header is empty")
        }

        let tokenParts = token.split(" ")
        token = tokenParts.pop()
        if (!token) {
            throw new HttpException(401, 'Unauthorized')
        }

        const blacklistedToken = await prisma.blacklistedToken.findUnique({ where: { token } });
        if (blacklistedToken) return res.sendStatus(403);
        
        const secret = process.env.JWT_ACCESS_TOKEN_SECRET;
        if (!secret) {
            throw new HttpException(500, 'JWT secret is not defined');
        }
        
        JWT.verify(token, secret, async (err: any, decoded: any)=>{
            if(err){
                return res.status(403).json({ message: 'Unauthorized!' });
            }
            const user = await prisma.users.findUnique({
                where: {
                    id: decoded.id
                },
                include: {
                    roles: true
                }
            });

            if (!user) {
                throw new HttpException(400, "User not found");
            }

            req.userId = decoded.id;
            req.role = user.roles.title;
            next();
        })
    } catch (error) {
        next(error)
    }
}

// module.exports = validateToken

