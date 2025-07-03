import express from 'express';
import { likeList, unlikeList, addComment, deleteComment, getLikes, getComments, getLikeCommentCounts } from '../controllers/profile/listController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id/like', protect, getLikes);      // get likes and isLiked
router.post('/:id/like', protect, likeList);     // like the list
router.delete('/:id/like', protect, unlikeList); // DELETE like ✅
router.get('/:id/counts', getLikeCommentCounts); 
router.get('/:id/comment', getComments);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment); // delete comment

export default router;
