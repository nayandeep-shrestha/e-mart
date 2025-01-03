import { NextFunction, Request, Response, Router } from "express";
const router = Router();
import { validateToken } from "../middleware/validateToken";
import HttpException from "../models/http-exception.model";
import { allow } from "../middleware/rbac";
import {
  addBanner,
  createBanner,
  deleteBanner,
  getAllBanner,
} from "../services/banner.service";
const uploader = require("../middleware/upload");

//create Banner
router.post(
  "/create",
  validateToken,
  allow(["super admin", 'admin', 'staff']),
  uploader.array("images", 1),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      type requestFile = typeof req.files;
      const image: requestFile = req.files;
      const userId = req.userId;
      const name = req.body.name;



      //for product ID
      const productIdsString: string = req.body.productIds;
      const productIds: number[] = productIdsString
        ? JSON.parse(productIdsString)
        : [];

      //for category ID
      const categoryIdsString: string = req.body.categoryIds;
      const categoryIds: number[] = categoryIdsString
        ? JSON.parse(categoryIdsString)
        : [];

      console;
      if (!userId) throw new HttpException(400, "User id is not defined");
      if (!name) throw new HttpException(400, "Name can't be blank");
      if (
        (!productIds || productIds.length === 0) &&
        (!categoryIds || categoryIds.length === 0)
      ) {
        throw new HttpException(
          400,
          "ProductIds or CategoryIds must be included"
        );
      }
      if (
        productIds &&
        productIds.length > 0 &&
        categoryIds &&
        categoryIds.length > 0
      ) {
        throw new HttpException(
          400,
          "Cannot include both productIds and categoryIds"
        );
      }
      if (Array.isArray(image)) {
        const banner = await createBanner(
          name,
          userId,
          image,
          req.role,
          productIds,
          categoryIds,
        );
        res.status(201).json({
          msg: "Banner created",
          result: {
            ...banner,
            productId: productIds,
            categoryId: categoryIds,
          },
        });
      }
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
);

//delete Banner
router.delete(
  "/:bannerId",
  validateToken,
  allow(["super admin", 'admin', 'staff']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedBanner = await deleteBanner(Number(req.params.bannerId), req.userId, req.role);
      res.status(201).json({
        msg: "Banner Deleted",
        result: deletedBanner,
      });
    } catch (error) {
      next(error);
    }
  }
);

//get All Banners Data
router.get(
  "/",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const banner = await getAllBanner();
      res.status(200).json({
        msg: "Retrieved data",
        result: { banner },
      });
    } catch (error) {
      next(error);
    }
  }
);

//add Banner -> for emart without product | category link
router.post(
  "/",
  validateToken,
  allow(["super admin", 'admin', 'staff']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const {name} = req.body;

      if (!userId) throw new HttpException(400, "User id is not defined");
      const banner = await addBanner(userId, req.role, name)
      
      res.status(201).json({
          msg: "Banner created",
          result: banner,
        });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
