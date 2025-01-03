import { NextFunction, Request, Response, Router } from 'express';
const router = Router()

import { validateToken } from '../middleware/validateToken';
import { allow } from '../middleware/rbac';
import { createStaff, deleteStaffById, getStaffsByUserId, updateStaffById } from '../services/staff.service';

router.post('/', validateToken, allow(['Wholesaler']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staffData = await createStaff(req.body, req.userId)
        res.status(201).json({
            msg: "Staff created successfully",
            result: staffData
        });
    } catch (error) {
        next(error)
    }
})

router.get('/', validateToken, allow(['Wholesaler']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staffsList = await getStaffsByUserId(req.userId)
        res.status(200).json({
            msg: "Staffs list fetched",
            result: staffsList
        })
    } catch (error) {
        next(error)
    }
})

router.delete('/:staffId', validateToken, allow(['Wholesaler']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let staffId: number | undefined = Number(req.params.staffId)
        
        const userId : number | undefined = req.userId

        const deletedStaffData = await deleteStaffById(staffId, userId)
        res.status(201).json({
            msg: "staff deleted",
            result: deletedStaffData
        })

    } catch (error) {
        next(error)
    }
})

router.patch('/:staffId', validateToken, allow(['Wholesaler']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedStaffData = await updateStaffById(Number(req.params.staffId), req.body, req.userId)
        res.status(201).json({
            msg: "Staff data updated successfully",
            result: updatedStaffData
        });

    } catch (error) {
        next(error)
    }
})


export default router


