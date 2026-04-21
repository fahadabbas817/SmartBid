import express from 'express'
const router = express.Router()
import { contactForm,getContactMessages} from '../controllers/contactusController.js'
import { protect, admin } from '../middleware/authMiddleware.js'


// router.route('/').post(contactForm)
// router.route('/').get(getContactMessages)
router.route('/').post( contactForm).get(protect, admin, getContactMessages)


export default router