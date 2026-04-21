import express from 'express';
const router = express.Router();
import { liveForm, getBidMessages, getLatestRecord, deleteAllRecords, placeBid } from '../controllers/liveController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/all').get(protect, admin, getBidMessages);
router.route('/all').post(liveForm);
// Only fully authenticated platform users are legally allowed to submit bids over REST
router.route('/bid').post(protect, placeBid);
router.route('/highest').get(getLatestRecord);
router.route('/clear').delete(protect, admin, deleteAllRecords);

export default router;
