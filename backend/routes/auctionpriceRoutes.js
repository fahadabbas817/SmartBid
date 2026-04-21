import express from 'express'
const router = express.Router()
import { auctionForm,getLatestAuction} from '../controllers/auctionpriceController.js'
import { protect, admin } from '../middleware/authMiddleware.js'


router.route('/update').post( auctionForm).get(getLatestAuction)

export default router