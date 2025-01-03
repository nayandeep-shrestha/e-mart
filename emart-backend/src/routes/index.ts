import { Router } from "express"
const router:Router = Router()
import authController from '../controller/auth.controller'
import userController from '../controller/user.controller'
import storeController from '../controller/store.controller'
import staffController from '../controller/staff.controller'
import productController from '../controller/product.controller'
import categoryController from '../controller/category.controller'
import orderController from '../controller/order.controller'
import cartController from '../controller/cart.controller'
import imageController from '../controller/image.controller'
import bannerController from '../controller/banner.controller'
import paymentController from '../controller/payment.controller'
import offerController from '../controller/offer.controller'
import uomController from '../controller/uom.controller'
import transactionController from '../controller/transaction.controller'

router.use('/auth', authController)
router.use('/users', userController)
router.use('/stores', storeController)
// router.use('/staffs', staffController)
router.use('/category',categoryController)
router.use('/products',productController)
router.use('/orders',orderController)
router.use('/carts',cartController)
router.use('/images',imageController)
router.use('/banners', bannerController)
router.use('/', paymentController)
router.use('/offers', offerController)
router.use('/UOM', uomController)
router.use('/transactions', transactionController)


export default router;