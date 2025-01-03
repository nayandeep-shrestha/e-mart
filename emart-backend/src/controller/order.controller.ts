import { allow } from "../middleware/rbac";
import { validateToken } from "../middleware/validateToken";
import HttpException from "../models/http-exception.model";
import { cancelOrder, getOrdersByUserId, getOrdersReceived, placeOrder, updateOrderStatus, updatePayStatus } from "../services/order.service";
import { NextFunction, Request, Response, Router } from "express";
const router: Router = Router();

//place a order
router.post( "/", validateToken, allow(['Retailer']), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: number | undefined = req.userId
      if (typeof userId == "undefined") throw new HttpException(400, 'Data not defined');
      
      const addressId: number | undefined = Number(req.params.addressId)
      if (typeof addressId == "undefined") throw new HttpException(400, 'Address not defined');

      const createdOrder = await placeOrder(req.body, userId);
      if (!createdOrder) {
        throw new HttpException(400, "Order creation failed");
      }
      res.status(201).json({
        msg: "Order Created",
        result: createdOrder,
      });
    } catch (error) {
      next(error);
    }
  }
);

//update order status
router.patch('/:orderId/updateStatus', validateToken, allow(['super admin','admin', 'staff']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId: number = Number(req.params.orderId)
    const {status} = req.body
    if(!status) throw new HttpException(400, "Status can't be blank")

    const updatedOrderStatus = await updateOrderStatus(orderId, status, req.userId, req.role)
    res.status(201).json({
      msg: "Order status updated",
      result: updatedOrderStatus
    })
  } catch (error) {
    next(error)
  }
})

//cancel order
router.post('/:orderId/cancelOrder', validateToken, allow(['admin','staff', 'super admin']), async (req:Request, res:Response, next: NextFunction) => {
  try {
    const orderId:number | undefined = Number(req.params.orderId)
    if(typeof orderId === undefined) throw new HttpException(400, "Order id is not defined")
    
    const cancelledOrder = await cancelOrder(orderId, req.userId, req.role)
    res.status(201).json({
      msg:"Order Cancelled",
      result: cancelledOrder
    })
  } catch (error) {
    next(error)
  }
})

//get order list for retailer
router.get('/', validateToken, allow(['Retailer']), async (req:Request, res:Response, next:NextFunction) => {
  try {
    const userId: number | undefined = req.userId
    if(typeof userId === undefined) throw new HttpException(400, "User id not defined")
    const orderList = await getOrdersByUserId(userId)
    res.status(200).json({
      msg:"Order list fetched",
      result:orderList
    })
  } catch (error) {
    next(error)
  }
})

//get orders recieved
router.get('/lists/', validateToken, allow(['super admin', 'admin', 'staff']), async (req:Request, res:Response, next:NextFunction) => {
  try {
    const userId: number | undefined = req.userId;
    if(typeof userId === undefined) throw new HttpException(400, "Id not defined")
   
    const orderList = await getOrdersReceived(userId, req.role)
    res.status(200).json({
      msg: "Orders fetched",
      result:orderList  
    })
  } catch (error) {
    next(error)
  }
})

//mark payment status to paid
router.patch('/:orderId/payStatus', validateToken, allow(['super admin','admin', 'staff']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId: number = Number(req.params.orderId)
    if(!orderId) throw new HttpException(400, "Order id not defined")

    await updatePayStatus(orderId, req.userId, req.role)
    res.status(201).json({
      msg: "Payment status updated"
    })
  } catch (error) {
    next(error)
  }
})

export default router;
