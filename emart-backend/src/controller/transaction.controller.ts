import { NextFunction, Request, Response, Router } from 'express';
const router = Router();
import { validateToken } from '../middleware/validateToken'
import HttpException from '../models/http-exception.model';
import { fetchTransactionHistory } from '../services/transaction.service';
import { allow } from '../middleware/rbac';

router.get('/', validateToken, allow(["super admin", 'admin', 'staff']), async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        let userId: number | undefined = req.userId
        if (typeof userId === null || typeof userId === undefined) throw new HttpException(400,"User id not provided")

            const transaction = await fetchTransactionHistory(userId, req.role);
            res.status(200).json({
                msg: "Transactions Fetched",
                result: transaction
            })
        } catch (error) {
            next(error)
        }
    })

export default router;
