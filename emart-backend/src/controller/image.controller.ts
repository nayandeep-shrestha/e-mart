import { NextFunction, Request, Response, Router } from 'express';
const router = Router()
import { deleteImage, getImageUrl, uploadImage } from '../services/image.service';
import { allow } from '../middleware/rbac';
import { validateToken } from '../middleware/validateToken';
import HttpException from '../models/http-exception.model';
const uploader = require("../middleware/upload");

router.get('/:name', validateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const url = await getImageUrl(req.params.name)
        res.status(200).json({
            msg: "Image url fetched",
            result: url
        });
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/product/:productId', validateToken, allow(['super admin', 'admin', 'staff']), uploader.array("images",1), async (req: Request, res: Response, next: NextFunction) => {
    try {
        type requestFile = typeof req.files;
        const images: requestFile = req.files;

        if (Array.isArray(images)) {
            const imagePaths = await uploadImage(images, Number(req.params.productId), req.userId, req.role)
            res.status(201).json({
                msg: "image upload successful",
                result: imagePaths
            })
        }

    } catch (error) {
        next(error)
    }
})

router.delete('/:imageFilename', validateToken, allow(['super admin', 'admin', 'staff']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let imageFilename: string | undefined = req.params.imageFilename
        if (!imageFilename) throw new HttpException(400, "image name not deifned")

        await deleteImage(imageFilename, req.userId, req.role)
        res.status(201).json({
            msg: "image deleted"
        })

    } catch (error) {
        next(error)
    }
})


export default router