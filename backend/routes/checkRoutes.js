import { getChecks,updateCheck} from '../controllers/checkController.js'
import express from 'express'
const router = express.Router();

router.route('/').get(getChecks);
router.route('/update').put(updateCheck);

export default router;