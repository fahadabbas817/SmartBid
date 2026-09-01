import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  endAuctionEarly,
  republishAuctions,
  getMyProducts,
} from '../controllers/productController.js'
import { protect, admin, adminOrSeller } from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(protect, adminOrSeller, createProduct)
router.get('/top', getTopProducts)
router.put('/republish-auctions', protect, adminOrSeller, republishAuctions)
router.get('/mine', protect, adminOrSeller, getMyProducts)
router.route('/:id/reviews').post(protect, createProductReview)
router.route('/:id/end-auction').put(protect, adminOrSeller, endAuctionEarly)
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, adminOrSeller, deleteProduct)
  .put(protect, adminOrSeller, updateProduct)

export default router
