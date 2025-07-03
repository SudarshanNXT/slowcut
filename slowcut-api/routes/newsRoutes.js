import express from 'express';
import { getMovieNews } from '../controllers/filmNewsController.js';

const router = express.Router();

// GET /api/news?q=inception (optional query)
router.get('/', getMovieNews);

export default router;
