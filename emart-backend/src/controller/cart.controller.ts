import { NextFunction, Request, Response, Router } from "express";
import { addAddress, addToCart, clearCart, clearItemsFromCart, deleteAddress, editAddress, updateQuantity, viewCart } from "../services/cart.service";
import { validateToken } from "../middleware/validateToken";
import HttpException from "../models/http-exception.model";
import { allow } from "../middleware/rbac";

const router: Router = Router();

//add to cart
router.post('/', validateToken, allow(['Retailer']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number | undefined = req.userId;
    if (!userId) throw new HttpException(400, "User id not defined")

    const addedData = await addToCart(userId, req.body)
    res.status(201).json({
      msg: "Data added to cart",
      result: addedData
    })
  } catch (error) {
    next(error)
  }
})

//clear cart
router.post('/clear', validateToken, allow(['Retailer']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number | undefined = req.userId;
    if (!userId) throw new HttpException(400, "User id not defined")

    const clearedData = await clearCart(userId)
    res.status(201).json({
      msg: "Cart is cleared",
      result: clearedData
    })
  } catch (error) {
    next(error)
  }
})

//clear specific items from cart
router.post('/clear/products', validateToken, allow(['Retailer']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number | undefined = req.userId;
    if (!userId) throw new HttpException(400, "User id not defined")

    let productIds: number[];

    // Ensure req.query.productIds is a string and parse it as JSON
    if (typeof req.query.productIds === 'string') {
      try {
        productIds = JSON.parse(req.query.productIds);
      } catch (error) {
        throw new HttpException(400, "Invalid productIds format");
      }
    } else if (Array.isArray(req.query.productIds)) {
      // If it's an array, map the values to integers
      productIds = (req.query.productIds as string[]).map(id => parseInt(id, 10));
    } else {
      throw new HttpException(400, "Invalid productIds format");
    }

    // Ensure productIds is an array of numbers
    if (!Array.isArray(productIds) || !productIds.every(id => typeof id === 'number')) {
      throw new HttpException(400, "Invalid productIds format");
    }
    const clearedData = await clearItemsFromCart(userId, productIds)
    res.status(201).json({
      msg: "Cart is cleared",
      result: clearedData
    })
  } catch (error) {
    next(error)
  }
})

//view cart
router.get('/', validateToken, allow(['Retailer']), async (req: Request, res:Response, next:NextFunction) => {
  try{
    const userId: number | undefined = req.userId;
    if (!userId) throw new HttpException(400, "User id not defined")

    const cartDetails = await viewCart(userId)
    res.status(200).json({
      msg:"Cart details fetched",
      result: cartDetails
    })
  }catch(error) {
    next(error)
  }
})

//update quantity
router.put('/', validateToken, allow(['Retailer']), async (req: Request, res:Response, next:NextFunction) => {
  try {
    const userId: number | undefined = req.userId;
    if (!userId) throw new HttpException(400, "User id not defined")

    const updatedCart = await updateQuantity(userId, req.body)
    res.status(201).json({
      msg: "Quantities updated",
      result: updatedCart
    })
  } catch (error) {
    next(error)
  }
})

//add address
router.post('/address', validateToken, allow(['Retailer']), async(req:Request, res:Response, next:NextFunction) => {
  try {
    const userId: number | undefined = req.userId;
    if (!userId) throw new HttpException(400, "User id not defined")

    const addedAddress = await addAddress(userId, req.body)
    res.status(201).json({
      msg: "Address added",
      result: addedAddress
    })
  } catch (error) {
    next(error)
  }
})

//edit address
router.put('/address/:addressId', validateToken, allow(['Retailer']), async (req:Request, res:Response, next: NextFunction) => {
  try {
    const addressId : number | undefined = Number(req.params.addressId)
    if(typeof addressId === undefined) throw new HttpException(400, "Address id is undefined")

    const updatedAddress = await editAddress(addressId, req.body)
    res.status(201).json({
      msg: "Address edited",
      result: updatedAddress
    })
  } catch (error) {
    next(error)
  }
})

//delete address
router.delete('/address/:addressId', validateToken, allow(['Retailer']), async (req:Request, res: Response, next: NextFunction) => {
  try {
    const addressId : number | undefined = Number(req.params.addressId)
    if(typeof addressId === undefined) throw new HttpException(400, "Address id is undefined")

    const deletedAddress = await deleteAddress(addressId)
    res.status(201).json({
      msg: "Address deleted",
      result: deletedAddress
    })
  } catch (error) {
    next(error)
  }
})
export default router