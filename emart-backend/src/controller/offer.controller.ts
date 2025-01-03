import { NextFunction, Request, Response, Router } from "express";
import { validateToken } from "../middleware/validateToken";
import { allow } from "../middleware/rbac";
import { createOffer, deleteOffer, getOffers, handleOfferProduct } from "../services/offer.service";
import HttpException from "../models/http-exception.model";
const uploader = require("../middleware/upload");
const router: Router = Router();

router.post("/", validateToken, allow(['super admin', 'admin', 'staff']), uploader.array('images', 1), async (req: Request, res: Response, next: NextFunction) => {
    try {
        type requestFile = typeof req.files;
        const images: requestFile = req.files;
        if (Array.isArray(images)) {
            const offer = await createOffer(req.body, images, req.userId, req.role);
            res.status(201).json({ msg: "Offer Created", result: offer });
        }
    } catch (error) {
        next(error)
    }
})

router.delete('/:offerId', validateToken, allow(['super admin', 'admin', 'staff']), async(req:Request, res:Response, next: NextFunction) => {
    try {
        const userId: number | null = req.userId
        if(!userId) throw new HttpException(400, "User id not defined")
        const deletedOffer = await deleteOffer(Number(req.params.offerId), userId, req.role)
        res.status(201).json({
            msg:"Order deleted",
            result: deletedOffer
        })
    } catch (error) {
        next(error)
    }
})

router.get('/', validateToken, allow(['super admin', 'admin', 'staff']), async(req:Request, res:Response, next:NextFunction) => {
    try {
        const userId: number | undefined = req.userId
        if(!userId) throw new HttpException(400, "User id is not defined")
        const offersList = await getOffers(userId, req.role)
        res.status(200).json({
            msg:"Offers fetched",
            result: offersList
        })
    } catch (error) {
        next(error)
    }
})

router.post('/:productId/offer-products/', validateToken, allow(['super admin', 'admin', 'staff']), async(req:Request, res:Response, next:NextFunction) => {
    try {
        const userId: number | undefined = req.userId
        if(!userId) throw new HttpException(400, "User id is not defined")
        const productId: number | undefined = Number(req.params.productId)
    if(!productId) throw new HttpException(400, "Product id is not defined")

        const {offerIds} = req.body
        const result = await handleOfferProduct(offerIds, productId, userId,req.role)
        res.status(201).json({
            msg: result === true ? "Offers cleared" : "Offers in product updated",
            result: result
        })
    } catch (error) {
        next(error)
    }
})

export default router