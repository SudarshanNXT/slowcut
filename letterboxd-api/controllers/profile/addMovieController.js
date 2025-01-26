import asyncHandler from "express-async-handler"
import User from "../../models/userModel.js"
import Profile from "../../models/profileModel.js"
import Movie from "../../models/movieModel.js"
import List from "../../models/listModel.js"
import listStatusArr from "../../utils/listStatusArr.js"
import Review from "../../models/reviewModel.js"

// @desc Add movie to profile (either liked, watched, watchlist)
// route POST api/profile/add_movie_to_profile
// @access Private
const addMovieToProfile = asyncHandler(async (req, res) => {
    const { title, id, image, genres, release_date, rating } = req.body
    const { field } = req.params
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //check if movie is already in db, if not then create it
    let movie = await Movie.findOne({ id: id })
    let flag = false
    if(!movie){
        movie = await Movie.create({
            title: title,
            id: id,
            image: image,
            genres: genres,
            release_date: release_date
        })
    } else {
        flag = true
    }

    //add to profile depending on field
    if(field === 'liked'){
        profile.liked_movies.push({
            movie: movie._id,
            id: movie.id
        })
    } else if(field === 'watched'){
        //determine whether movie is already in profile's watched movies
        const watchMovieStatus = profile.watched_movies.some(item => item.movie._id.toString() === movie._id.toString())
        if(watchMovieStatus) {
            
            const index = profile.watched_movies.findIndex(item => item.movie.toString() === movie._id.toString())
            profile.watched_movies[index].rating = rating
            await profile.save()
        } else {
            profile.watched_movies.push({
                movie: movie._id,
                id: movie.id,
                rating: rating ? rating : null
            })
        }
    } else if(field === 'watchlist'){
        profile.watchlist.push({
            movie: movie._id,
            id: movie.id
        })
    }
    await profile.save()

    res.json(`${movie.title} added to ${user.username}'s profile`)
})

// @desc Remove movie from user's profile (liked, watched, watchlist)
// route POST api/profile/remove_movie_from_profile
// @access Private
const removeMovieFromProfile = asyncHandler(async (req, res) => {
    const { id } = req.query
    const { field } = req.params
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    //find the movie in db
    const movie = await Movie.findOne({ id: id })
    if(!movie){
        res.status(400)
        throw new Error('Error removing movie from watched movies')
    }

    if(field === 'liked'){
        const index = profile.liked_movies.findIndex(item => item.movie._id.toString() === movie._id.toString())
        profile.liked_movies.splice(index, 1)
    } else if(field === 'watched'){
        const index = profile.watched_movies.findIndex(item => item.movie._id.toString() === movie._id.toString())
        profile.watched_movies.splice(index, 1)
    } else if(field === 'watchlist'){
        const index = profile.watchlist.findIndex(item => item.movie._id.toString() === movie._id.toString())
        profile.watchlist.splice(index, 1)
    }
    await profile.save()
    res.json(`${movie.title} removed from ${user.username}'s watched movies`)
})

// @desc Check liked, watched, watchlisted status for particular movie, also returns list of user lists with status flag, checks if its in diary
// route POST api/profile/movie_status
// @access Private
const getMovieStatus = asyncHandler(async (req, res) => {
    const { id } = req.query
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })
    const userLists = await List.find({ creator: user.username })

    if(!profile){
        res.status(404)
        throw new Error('User not found')
    }

    //check if movie is in db
    const movie = await Movie.findOne({ id: id })
    if(!movie){
        res.json({
            liked_movie_status: false,
            watch_status: false,
            watchlist_status: false,
            list_status_arr: listStatusArr(userLists, movie)
        })
        return
    }

    //check if its in profile's different fields
    const likedMovieStatus = profile.liked_movies.some(item => item.movie._id.toString() === movie._id.toString())
    const watchMovieStatus = profile.watched_movies.some(item => item.movie._id.toString() === movie._id.toString())
    const watchlistStatus = profile.watchlist.some(item => item.movie._id.toString() === movie._id.toString())
    const diaryStatus = profile.diary.some(item => item.movie._id.toString() === movie._id.toString())
    const reviewCheck = await Review.findOne({ creator: user.username, movie: movie._id })
    const reviewStatus = reviewCheck ? true : false
    
    //get rating status, if its watched, grab the index and then the rating
    const ratingIndex = profile.watched_movies.findIndex(item => item.movie._id.toString() === movie._id.toString())
    const ratingStatus = ratingIndex !== -1 ? profile.watched_movies[ratingIndex].rating : null

    res.json({
        liked_movie_status: likedMovieStatus,
        watch_status: watchMovieStatus,
        watchlist_status: watchlistStatus,
        diary_status: diaryStatus,
        review_status: reviewStatus,
        rating_status: ratingStatus,
        list_status_arr: listStatusArr(userLists, movie)
    })
})

export {
    addMovieToProfile,
    removeMovieFromProfile,
    getMovieStatus
}