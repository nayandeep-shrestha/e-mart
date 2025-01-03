import { NextFunction, Request, Response, Router } from 'express';
import { validateToken } from '../middleware/validateToken';
import { allow } from '../middleware/rbac';
import HttpException from '../models/http-exception.model';
import { checkPaymentStatus, initializePayment, updatePaymentStatus, verifyPayment } from '../services/payment.service';
import crypto from 'crypto';
const router = Router();

router.post('/initialize-payment', validateToken, allow(['Retailer']), async(req:Request, res:Response, next:NextFunction) => {
    try {
        const userId: number | undefined = req.userId;
        if(!userId) throw new HttpException(400, "User id not defined")

        const paymentResponse = await initializePayment(userId, req.body)

        res.status(201).json(paymentResponse)
    } catch (error) {
        next(error)
    }
})

router.get('/verify/:reference', validateToken, allow(['Retailer']), async(req:Request, res:Response, next:NextFunction) => {
    try{
        const reference: string| undefined = req.params.reference
        if(!reference) throw new HttpException(400, "Invalid reference")

        const verification = await verifyPayment(reference)
        res.status(200).json(verification)
    }catch(error){
        next(error)
    }
})


router.post('/paystack-webhook', async(req:Request, res:Response, next:NextFunction) => {
    try{
        const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET!)
                           .update(JSON.stringify(req.body))
                           .digest('hex');
    
        // Verify webhook signature
        if (hash === req.headers['x-paystack-signature']) {
            const event = req.body;
    
            // Handle different event types
            switch (event.event) {
                case 'charge.success':
                    
                    updatePaymentStatus(Number(event.data.reference))
                    res.status(201).json({
                        msg: "Payment success"
                    })
                    // Handle successful charge
                    break;
                case 'charge.failed':
                    res.status(400).json({
                        msg:"Transaction failed"
                    })
                    // Handle failed charge
                    break;
                // Add more cases for other event types as needed
                default:
                    console.log('Unhandled event type:', event.event);
            }
        } else {
            // Invalid webhook signature
            res.status(401).json('Invalid webhook signature');
        }
    }catch(error){
        next(error)
    }
});

router.get('/payment-status/:orderId', async (req:Request, res:Response, next:NextFunction) => {
    try {
        const { orderId } = req.params;
        if(!orderId) throw new HttpException(400, "Order id is not defined")
        const payStatus = await checkPaymentStatus(Number(orderId))
        res.status(200).json({
            msg:"payment status fetched",
            result: payStatus
        })
        
    } catch (error) {
        next(error)
    }
});
  


export default router