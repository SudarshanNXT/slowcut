import express from 'express';
import { getProfileData} from '../controllers/profile/profileController.js'
import { addMovieToProfile, removeMovieFromProfile, getMovieStatus} from '../controllers/profile/addMovieController.js'
import {
    createList,
    deleteList,
    addMoviesToLists,
    removeMovieFromList,
    getListData,
    updateListData
} from '../controllers/profile/listController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/add_movie_to_profile/:field').post(protect, addMovieToProfile)
router.route('/remove_movie_from_profile/:field').delete(protect, removeMovieFromProfile)
router.route('/movie_status').get(protect, getMovieStatus)
router.route('/create_list').post(protect, createList)
router.route('/delete_list/:id').delete(protect, deleteList)
router.route('/add_movies_to_lists').post(protect, addMoviesToLists)
router.route('/remove_movie_from_list').delete(protect, removeMovieFromList)
router.route('/get_profile_data').get(protect, getProfileData)
router.route('/get_list_data/:id').get(protect, getListData)
router.route('/update_list_data/:id').put(protect, updateListData)

export default router