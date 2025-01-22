import asyncHandler from "express-async-handler"
import User from "../../models/userModel.js"
import Profile from "../../models/profileModel.js"
import Movie from "../../models/movieModel.js"
import List from "../../models/listModel.js"
import listStatusArr from "../../utils/listStatusArr.js"

// @desc Add movie to profile (either liked, watched, watchlist)
// route POST api/profile/addMovieToProfile
// @access Private
const addMovieToProfile = asyncHandler(async (req, res) => {
    const { title, id, image, genres, release_date } = req.body
    const { field } = req.params
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //check if movie is already in db, if not then create it
    let movie = await Movie.findOne({ id: id })
    if(!movie){
        movie = await Movie.create({
            title: title,
            id: id,
            image: image,
            genres: genres,
            release_date: release_date
        })
    }

    //add to profile depending on field
    if(field === 'liked'){
        profile.liked_movies.push({
            movie: movie._id,
            id: movie.id
        })
    } else if(field === 'watched'){
        profile.watched_movies.push({
            movie: movie._id,
            id: movie.id
        })
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

// @desc Check liked, watched, watchlisted status for particular movie, also returns list of user lists with status flag
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

    //check if its in profile's liked movies
    const likedMovieStatus = profile.liked_movies.some(item => item.movie._id.toString() === movie._id.toString())
    const watchMovieStatus = profile.watched_movies.some(item => item.movie._id.toString() === movie._id.toString())
    const watchlistStatus = profile.watchlist.some(item => item.movie._id.toString() === movie._id.toString())
    res.json({
        liked_movie_status: likedMovieStatus,
        watch_status: watchMovieStatus,
        watchlist_status: watchlistStatus,
        list_status_arr: listStatusArr(userLists, movie)
    })
})

export {
    addMovieToProfile,
    removeMovieFromProfile,
    getMovieStatus
}