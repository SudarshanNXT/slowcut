import express from 'express'
import {
    search,
    getFilms,
    getMovieDetails
} from '../controllers/tmdbController.js'

const router = express.Router()

router.get('/search', search)
router.get('/films', getFilms)
// router.get('/trending', getTrending)
// router.get('/popular', getPopular)
// router.get('/movie_page', getMoviePageData)
// router.get('/tv_page', getTvPageData)
// router.get('/people_page', getPeoplePageData)
router.get('/movie_details', getMovieDetails)
// router.get('/tv_show_details', getTvShowDetails)
// router.get('/person_details', getPersonDetails)

export default router