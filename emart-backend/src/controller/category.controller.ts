import { NextFunction, Request, Response, Router } from "express";
const router: Router = Router()
import { allow } from '../middleware/rbac';
import { CategoryCreatePayload, CategoryResponse } from "../models/category.model";
import HttpException from "../models/http-exception.model";
import { createCategory, deleteCategoryById, getAllCategory, updateCategory } from "../services/category.service";
import { validateToken } from "../middleware/validateToken";

router.post('/', validateToken, allow(['super admin', 'admin']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryData: CategoryCreatePayload | undefined = req.body
        if (!categoryData || typeof categoryData === undefined) throw new HttpException(400, "Category data is not defined")
        
        let userId: number | undefined = req.userId
        if (typeof userId === null || typeof userId === undefined) throw new HttpException(400,"User id not provided")

        const createdCategory: CategoryResponse = await createCategory(categoryData, userId, req.role)
        res.status(201).json({
            msg: "Category created",
            result: createdCategory
        })
    } catch (error) {
        next(error)
    }
})

router.delete('/:categoryId', validateToken, allow(['super admin', 'admin']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let categoryId: number | undefined = Number(req.params.categoryId)
        if (typeof categoryId === undefined) throw new HttpException(400, "Category id is not defined")
              
        let userId: number | undefined = req.userId
        if (typeof userId === null || typeof userId === undefined) throw new HttpException(400,"User id not provided")

        const deletedCategory = await deleteCategoryById(categoryId, userId, req.role)
        res.status(201).json({
            msg: "Category deleted",
            result: deletedCategory
        });
    } catch (error) {
        next(error)
    }
})

router.get('/all-categories', validateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoriesData = await getAllCategory()
        if (!categoriesData) throw new HttpException(400, "Empty categories")
        res.status(200).json({
            msg: "Categories fetched",
            result: categoriesData
        })
    } catch (error) {
        next(error)
    }
})


router.patch('/:categoryId', validateToken, allow(['super admin', 'admin']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let categoryId: number | undefined = Number(req.params.categoryId)
        if (typeof categoryId === undefined) throw new HttpException(400, "Category id is not defined")

        const categoryData: CategoryCreatePayload | undefined = req.body
        if (!categoryData || typeof categoryData === undefined) throw new HttpException(400, "Category data is not defined")

                
        let userId: number | undefined = req.userId
        if (typeof userId === null || typeof userId === undefined) throw new HttpException(400,"User id not provided")
    
        const updatedCategory: CategoryResponse = await updateCategory(categoryData, categoryId, userId, req.role)
        res.status(201).json({
            msg: "Category updated",
            result: updatedCategory
        })
    } catch (error) {
        next(error)
    }
})

export default router