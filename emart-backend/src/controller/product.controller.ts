import { NextFunction, Request, Response, Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateDescription, updateProductById, uploadExcelProducts } from "../services/product.service";
import { validateToken } from "../middleware/validateToken";
import { allow } from '../middleware/rbac'
import HttpException from "../models/http-exception.model";
import multer from "multer";
import fs from 'fs';
const router: Router = Router();
const uploader = require("../middleware/upload");

const upload_path = (req: Request, res: Response, next: NextFunction) => {
  req.upload_path = "public/uploads/product";
  next();
};

const upload = multer({ dest: 'uploads/' });

router.post("/", validateToken, allow(['super admin', 'admin', 'staff']), uploader.array("images",1), async (req: Request, res: Response, next: NextFunction) => {
  try {
    type requestFile = typeof req.files;
    const images: requestFile = req.files;
    if (Array.isArray(images)) {
      const product = await createProduct(req.body, images, req.userId, req.role);
      res.status(201).json({ msg: "Successful", result: product });
    }
  } catch (error) {
    next(error)
  }
}
);

router.delete("/:id", validateToken, allow(['super admin', 'admin', 'staff']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    let productId: number | undefined = Number(req.params.id)
    if (typeof productId === null || typeof productId === undefined) throw new HttpException(400,"Product id not provided")
    
    let userId: number | undefined = req.userId
    if (typeof userId === null || typeof userId === undefined) throw new HttpException(400,"User id not provided")

    const deletedData = await deleteProduct(productId, userId, req.role);
    res.status(201).json({ msg: "Product deleted successfully", result: deletedData });
  } catch (error) {
    next(error)
  }
});

router.get("/:id", validateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    let productId: number | undefined = Number(req.params.id)
    if (typeof productId === null || typeof productId === undefined) throw new HttpException(400,"Product id not provided")

    const productData = await getProductById(productId)
    res.status(200).json({
      msg: "Product fetched",
      result: productData
    })
  } catch (error) {
    next(error)
  }
})

router.get("/", validateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const size: number = parseInt(req.query.size as string) || 5;
    let storeId: number | undefined;
    if ('storeId' in req.query) {
      storeId = parseInt(req.query.storeId as string);
    }
    const productList = await getAllProducts(page,size, storeId)
    res.status(200).json({
      msg: "Products fetched",
      result: productList
    })
  } catch (error) {
    next(error)
  }
})

router.put("/:productId", validateToken, allow(['super admin', 'admin', 'staff']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    let productId: number | undefined = Number(req.params.productId)
    if (typeof productId === null || typeof productId === undefined) throw new HttpException(400,"Product id not provided")

    let userId: number | undefined = req.userId
    if (typeof userId === null || typeof userId === undefined) throw new HttpException(400,"User id not provided")
    
    const updatedProduct = await updateProductById(productId, req.body, userId, req.role)
    if (!updatedProduct) throw new HttpException(400, "Product update failed")

    res.status(201).json({
        msg: "Product updated",
        result: updatedProduct
      })
    
  } catch (error) {
    next(error)
  }
})

router.post('/upload-excel', validateToken, allow(['super admin', 'admin', 'staff']), upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  const storeIds: number[] = req.body.storeIds ? JSON.parse(req.body.storeIds) : [];
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'File is required' });
  }
  try {
    const uploadProducts = await uploadExcelProducts(req.userId, file, storeIds);
    fs.unlinkSync(file.path);
    res.status(201).json({ msg: "Products uploaded" });
  } catch (error) {
    next(error);
  }
});

router.patch('/description', validateToken, allow(['super admin', 'admin', 'staff']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId: number | undefined = req.userId
    if (typeof userId === null || typeof userId === undefined) throw new HttpException(400,"User id not provided")
    const {productId, description} = req.body
    const updatedProduct = await updateDescription(userId, req.role, productId, description)
    if (!updatedProduct) throw new HttpException(400, "Product update failed")

    res.status(201).json({
        msg: "Description updated",
        result: updatedProduct,
      })
    
  } catch (error) {
    next(error)
  }
})

export default router;
