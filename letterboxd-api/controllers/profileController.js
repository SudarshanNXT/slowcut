import asyncHandler from "express-async-handler"
import User from '../models/userModel.js'
import Profile from "../models/profileModel.js"
import Movie from "../models/movieModel.js"
import List from "../models/listModel.js"
import listStatusArr from "../utils/listStatusArr.js"

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

// @desc Create new list
// route POST api/profile/create_list
// @access Private
const createList = asyncHandler(async (req, res) => {
    const { name, description, ranked, is_public } = req.body
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //input validation
    if(name.length > 50){
        res.status(400)
        throw new Error('List name too long.')
    }

    //create list
    const list = await List.create({
        name: name,
        description: description,
        creator: user.username,
        ranked: ranked,
        is_public: is_public,
        comments: [],
        list_items: []
    })

    res.json({
        list: list
    })
})

// @desc Add movies to lists (receives list of lists)
// route POST api/profile/add_movies_to_lists
// @access Private
const addMoviesToLists = asyncHandler(async (req, res) => {
    const { movie_id, list_of_lists, title, id, image, genres, release_date } = req.body

    //check if movie is already in db, if not then create it
    let movie = await Movie.findOne({ id: movie_id })
    if(!movie){
        movie = await Movie.create({
            title: title,
            id: id,
            image: image,
            genres: genres,
            release_date: release_date
        })
    }

    //iterate through list of lists and add movie to each
    for (const list_id of list_of_lists) {
        const list = await List.findById(list_id);
        list.list_items.push({
            item: movie._id,
            type: 'Movie',
            id: movie.id
        })
        await list.save()
      }

    res.json('Movies added to lists successfully')
})

// @desc Remove movie from list 
// route DELETE api/profile/remove_movie_from_list
// @access Private
const removeMovieFromList = asyncHandler(async (req, res) => {
    const { list_id, movie_id } = req.body
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //find the list
    const list = await List.findById(list_id)
    if(!list){
        res.status(404)
        throw new Error('List not found')
    }

    //check if user from request is the creator of the list
    if(list.creator !== user.username){
        res.status(404)
        throw new Error('Unauthorized')
    }

    //find the movie
    const movie = await Movie.findById(movie_id)
    if(!movie){
        res.status(404)
        throw new Error('Movie not found')
    }

    const index = list.list_items.findIndex(list_item => list_item.item.toString() === movie._id.toString())
    if(index !== -1){
        list.list_items.splice(index, 1)
        await list.save()
    }
    res.json(`${movie.title} removed from ${list.name}`)
})

// @desc Get List Data
// route GET api/profile/get_list_data
// @access Private
const getListData = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    const list = await List.findById(id)
    if(!list){
        res.status(404)
        throw new Error('List not found')
    }

    //iterate through list items and grab movie data for each
    const arr = []
    for(const movie_id of list.list_items){
        const movie = await Movie.findById(movie_id.item) 
        const movieObject = movie.toObject()
        movieObject['added_on'] = movie_id.added_on
        arr.push(movieObject)
    }

    res.json({
        list: list,
        movies: arr
    })
})

// @desc Get Profile Data
// route GET api/profile/get_profile_data
// @access Private
const getProfileData = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!user || !profile){
        res.status(404)
        throw new Error('User not found')
    }

    //grab the user's lists
    const userLists = await List.find({ creator: user.username })

    res.json({
        profile: profile,
        user_lists: userLists
    })
})

export {
    addMovieToProfile,
    removeMovieFromProfile,
    getMovieStatus,
    createList,
    addMoviesToLists,
    removeMovieFromList,
    getProfileData,
    getListData
}