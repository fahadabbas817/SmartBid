import express from 'express'
const router = express.Router()
import { suggestPrice, generateDescription, fetchImages } from '../controllers/aiController.js'
import { protect, adminOrSeller } from '../middleware/authMiddleware.js'

router.post('/suggest-price', protect, adminOrSeller, suggestPrice)
router.post('/generate-description', protect, adminOrSeller, generateDescription)
router.post('/fetch-images', protect, adminOrSeller, fetchImages)

export default router
