import express from 'express'
const router = express.Router()
import { suggestPrice, generateDescription } from '../controllers/aiController.js'
import { protect, seller, adminOrSeller } from '../middleware/authMiddleware.js'

router.post('/suggest-price', protect, adminOrSeller, suggestPrice)
router.post('/generate-description', protect, adminOrSeller, generateDescription)

export default router
