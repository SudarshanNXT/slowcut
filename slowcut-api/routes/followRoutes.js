import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  followUser,
  unfollowUser,
  getFollowsByUsername,
  isFollowingUser,
  getFollowCounts,
  getFollowListWithStats
} from '../controllers/followController.js';

const router = express.Router();

// FOLLOW / UNFOLLOW by username
router.post('/:username', protect, followUser);
router.delete('/unfollow/:username', protect, unfollowUser);

// Get followers/following by username
router.get('/follows/:username', getFollowsByUsername);
router.get('/list/:username/:type', getFollowListWithStats);
// Check follow status by username
router.get('/status/:username', protect, isFollowingUser);
router.get('/counts/:username', getFollowCounts);
export default router;
