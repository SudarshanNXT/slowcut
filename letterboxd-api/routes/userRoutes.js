import express from 'express';
import {
    authUser,
    registerUser,
    deleteProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/auth', authUser)
router.route('/delete_profile').delete(protect, deleteProfile)

export default router