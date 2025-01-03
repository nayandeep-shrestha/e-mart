import { NextFunction, Request, Response, Router } from 'express';
const router = Router();

import { validateToken } from '../middleware/validateToken';
import { createStore, fetchAllStores, updateStoreById, updateStoreStatus } from '../services/store.service';
import { allow } from '../middleware/rbac';
import HttpException from '../models/http-exception.model';

router.post('/',validateToken, allow(['Retailer']),async (req:Request, res: Response,next: NextFunction) => {
    try{
        const userId: number | undefined = req.userId;
        if(!userId) throw new HttpException(400, "User id is not defined");

        const storeData = await createStore(req.body, userId)
        res.status(201).json({
            msg:"Store created",
            result: storeData
        })
    }catch(error){
       next(error)
    }
})

router.get('/', validateToken, allow(['super admin', 'admin']), async (req: Request, res: Response, next:NextFunction) => {
    try{
        const userId: number | undefined = req.userId;
        if(!userId) throw new HttpException(400, "User id is not defined");

        const userRole : string | undefined = req.role;
        if(!userRole) throw new HttpException(400, "Role is not defined")

        const storesList = await fetchAllStores(userId, userRole);
        res.status(200).json({
            msg: "Stores list fetched",
            result: storesList
        })
    }catch(error){
        next(error)
    }
})

router.patch('/:storeId', validateToken, allow(['super admin', 'admin', 'retailer']), async(req:Request, res:Response, next: NextFunction)=> {
    try{
        let storeId : number | undefined = Number(req.params.storeId)
        if(typeof storeId === null || typeof storeId === undefined) throw "Store id not provided"

        const userId: number | undefined = req.userId;
        if(!userId) throw new HttpException(400, "User id is not defined");

        const updatedStoreData = await updateStoreById(storeId, req.body, userId, req.role)
        res.status(201).json({
            msg: "Store Data updated",
            result: updatedStoreData
        })
    }catch(error){
        next(error)
    }
})

router.patch('/update-status/:storeId', validateToken , allow(['super admin', 'admin']), async(req:Request, res:Response, next: NextFunction)=> {
    try{
        const storeId: number | undefined = Number(req.params.storeId)
    if (!storeId) throw new HttpException(400, "Store id is not defined")

    const updatedStore = await updateStoreStatus(storeId, req.userId, req.role)
    res.status(201).json({
        msg: "Status updated",
        result: updatedStore
    })
}catch(error){
    next(error)
}
})




export default router