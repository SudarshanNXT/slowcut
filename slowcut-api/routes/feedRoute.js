import express from 'express';
import {
  getFollowingUsersLists,
  getTopListsByEngagement,

} from '../controllers/profile/listController.js';
import {
  getTrendingReviews,
  getFollowingUsersReviews
} from '../controllers/profile/reviewController.js';


import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/top-reviews', getTrendingReviews);
router.get('/following/reviews', protect, getFollowingUsersReviews);
router.get('/following/lists', protect, getFollowingUsersLists);
router.get('/top-lists', getTopListsByEngagement);


export default router;