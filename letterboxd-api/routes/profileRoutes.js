import express from 'express';
import { addFavoriteFilm, deleteFavoriteFilm, getProfileData, getProfileSubData, updateProfile} from '../controllers/profile/profileController.js'
import { addMovieToProfile, removeMovieFromProfile, getMovieStatus} from '../controllers/profile/addMovieController.js'
import {
    createList,
    deleteList,
    addMoviesToLists,
    removeMovieFromList,
    getListData,
    updateListData
} from '../controllers/profile/listController.js'
import { addDiaryEntry, deleteDiaryEntry, getDiaryData, updateDiaryEntry } from '../controllers/profile/diaryController.js';
import { createReview, updateReview, getReviews, getReview, deleteReview } from '../controllers/profile/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/add_movie_to_profile/:field').post(protect, addMovieToProfile)
router.route('/remove_movie_from_profile/:field').delete(protect, removeMovieFromProfile)
router.route('/movie_status').get(protect, getMovieStatus)
router.route('/create_list').post(protect, createList)
router.route('/delete_list/:id').delete(protect, deleteList)
router.route('/add_movies_to_lists').post(protect, addMoviesToLists)
router.route('/remove_movie_from_list').delete(protect, removeMovieFromList)
router.route('/get_list_data/:id').get(protect, getListData)
router.route('/update_list_data/:id').put(protect, updateListData)
router.route('/add_diary_entry').post(protect, addDiaryEntry)
router.route('/update_diary_entry/:entry_id').put(protect, updateDiaryEntry)
router.route('/delete_diary_entry/:entry_id').delete(protect, deleteDiaryEntry)
router.route('/get_diary_data').get(protect, getDiaryData)
router.route('/create_review').post(protect, createReview)
router.route('/update_review/:id').put(protect, updateReview)
router.route('/delete_review/:id').delete(protect, deleteReview)
router.get('/get_reviews/:username', getReviews)
router.get('/get_review/:id', getReview)
router.get('/get_profile_data/:username', getProfileData)
router.get('/get_profile_sub_data/:username/:category', getProfileSubData)
router.route('/update_profile').put(protect, updateProfile)
router.route('/add_favorite_film').post(protect, addFavoriteFilm)
router.route('/delete_favorite_film/:id').delete(protect, deleteFavoriteFilm)

export default router