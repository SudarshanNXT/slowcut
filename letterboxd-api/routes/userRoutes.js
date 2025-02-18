import express from 'express';
import {
    authUser,
    registerUser,
    deleteProfile,
    checkToken,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/auth', authUser)
router.route('/delete_profile').delete(protect, deleteProfile)
router.route('/check_token').get(protect, checkToken)

export default router