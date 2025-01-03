import { NextFunction, Request, Response, Router } from 'express';
const router = Router();

import { validateToken } from '../middleware/validateToken';
import { allow } from '../middleware/rbac';
import { createUser, getAdminUsers, getStoreUsers, updateAdminUserStatus, updateStoreUserStatus, updateUser } from '../services/user.service';
import HttpException from '../models/http-exception.model';

router.post('/', validateToken, allow(["super admin","admin", "retailer"]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userData = req.body;
        const user = await createUser(userData, req.userId)
        res.status(201).json({
            msg: "User created successfully",
            result: user
        });

    } catch (error) {
        next(error)
    }

})

router.patch('/update-store-users/:userId', validateToken, allow(['super admin','admin', 'retailer']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: number | undefined = Number(req.params.userId)
        if (!userId) throw new HttpException(400, "User id is not defined")

        const deactivatedUser = await updateStoreUserStatus(userId, req.userId)
        res.status(201).json({
            msg: "Status updated",
            result: deactivatedUser
        })
    } catch (error) {
        next(error)
    }
})

router.patch('/update-admin-users/:userId', validateToken, allow(['super admin','admin']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: number | undefined = Number(req.params.userId)
        if (!userId) throw new HttpException(400, "User id is not defined")

        const deactivatedUser = await updateAdminUserStatus(userId, req.userId)
        res.status(201).json({
            msg: "Status updated",
            result: deactivatedUser
        })
    } catch (error) {
        next(error)
    }
})

router.get('/admin-users', validateToken, allow(["super admin","admin"]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.userId;
        if (typeof id === 'undefined') throw new HttpException(400, "Id is not defined")
        
        const usersList = await getAdminUsers(id)
        res.status(200).json({
            msg: "Users list fetched",
            result: usersList
        })
    } catch (error) {
        next(error)
    }
})
router.get('/store-users', validateToken, allow(["super admin","admin", 'retailer']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.userId;
        if (typeof id === 'undefined') throw new HttpException(400, "Id is not defined")
        
        const usersList = await getStoreUsers(id)
        res.status(200).json({
            msg: "Users list fetched",
            result: usersList
        })
    } catch (error) {
        next(error)
    }
})

router.patch('/:userId', validateToken, allow(['super admin','admin', 'retailer']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userData = req.body;
        const userId: number | undefined = Number(req.params.userId)
        if(!userId) throw new HttpException(400, "User id is not defined")

        const updatedUser = await updateUser(userData, userId, req.userId)
        res.status(201).json({
            msg: "User data updated",
            result: updatedUser
        })
    } catch (error) {
        next(error)
    }
})

export default router