// routes/searchRoutes.js
import express from 'express';
import { searchMemberUsers, getAllMembersStats } from '../controllers/searchController.js';

const router = express.Router();

router.get('/member', searchMemberUsers);
router.get('/member/stats', getAllMembersStats); // <-- Add this line

export default router;
