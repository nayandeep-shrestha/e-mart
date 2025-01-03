import { PrismaClient } from "@prisma/client";
import HttpException from "../models/http-exception.model";
const prisma = new PrismaClient()
import { bucket } from '../firebase';
import { imageUploadToFirebase } from "../utils/firebaseUpload";

export const getImageUrl = async (fileName: string) => {
    if (!fileName) throw new HttpException(400, "Filename empty")
    const blob = bucket.file(`uploads/${fileName}`);
    const imageData = await prisma.images.findFirst({
        where: {
            path: `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        }
    })
    if (!imageData) throw new HttpException(404, "No image of that name")
    const file = bucket.file(`uploads/${fileName}`);
    const url = await file.getSignedUrl({
        action: 'read',
        expires: '03-17-2025',
    });
    if (!url) throw new HttpException(404, "Image not found")
    return url
}

export const uploadImage = async (images: Express.Multer.File[], productId: number, userId: number, userRole: string) => {

    if (userRole === 'admin' || userRole == 'staff') {
        const checkUser = await prisma.users.findUnique({
            where: { id: userId },
            include: { manager: { include: { roles: true } } }
        })
        if (checkUser?.manager?.roles.title !== "super admin") throw new HttpException(401, 'Unauthorized access')
    }

    const checkProduct = await prisma.products.findUnique({
        where: {
            id: productId,
        }
    })
    if (!checkProduct) throw new HttpException(404, "Product not found")

    const imagePaths = await imageUploadToFirebase(images, 'products')
    for (const imagePath of imagePaths) {
        await prisma.images.create({
            data: {
                productId,
                path: imagePath
            }
        })
    }
    return imagePaths
}

export const deleteImage = async (imageFilename: string, userId: number, userRole: string) => {
    try {
        if (userRole === 'admin' || userRole == 'staff') {
            const checkUser = await prisma.users.findUnique({
                where: { id: userId },
                include: { manager: { include: { roles: true } } }
            })
            if (checkUser?.manager?.roles.title !== "super admin") throw new HttpException(401, 'Unauthorized access')
        }
    
        await bucket.file(`uploads/products/${imageFilename}`).delete();
        const imagePath = process.env.IMAGE_URL + 'products/' + imageFilename
        await prisma.images.deleteMany({
            where: {
                path: imagePath,
            }
        })

    } catch (error) {
        throw new HttpException(404, error);
    }
}