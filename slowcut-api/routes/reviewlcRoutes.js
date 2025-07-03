import express from 'express';
import {
  likeReview,
  unlikeReview,
  getReviewLikes,
  getReviewLikeCommentCounts,
  addReviewComment,
  getReviewComments,
  deleteReviewComment
} from '../controllers/profile/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id/like', protect, getReviewLikes);             // GET like count & isLiked
router.post('/:id/like', protect, likeReview);                // POST like
router.delete('/:id/like', protect, unlikeReview);            // DELETE unlike

router.get('/:id/counts', getReviewLikeCommentCounts);        // GET like & comment counts

router.get('/:id/comment', getReviewComments);                // GET comments
router.post('/:id/comment', protect, addReviewComment);       // POST comment
router.delete('/:id/comment/:commentId', protect, deleteReviewComment); // DELETE comment

export default router;
