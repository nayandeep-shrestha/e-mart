import { Router, Request, Response, NextFunction } from "express";
import { validateToken } from "../middleware/validateToken";
import { allow } from "../middleware/rbac";
import { identifyUnit } from "../services/uom.service";
const router: Router = Router();

router.get('/:productId/unit/:unitType', validateToken, allow(['Retailer']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId: number = Number(req.params.productId)
        const unitType: string = req.params.unitType
        const response = await identifyUnit(productId, unitType)
        res.status(200).json({
            msg: "Unit price fetched",
            result: response
        })
    } catch (error) {
        next(error)
    }
})

export default router;