import asyncHandler from "express-async-handler"
import User from '../../models/userModel.js'
import Profile from "../../models/profileModel.js"
import Movie from "../../models/movieModel.js"
import List from "../../models/listModel.js"
import listStatusArr from "../../utils/listStatusArr.js"
import { validateUsername } from "../../utils/inputValidation.js"
import mapGrabMovie from "../../utils/mapGrabMovie.js"
import Review from "../../models/reviewModel.js"

// @desc Get Profile Data
// route GET api/profile/get_profile_data
// @access Public
const getProfileData = asyncHandler(async (req, res) => {
    const { username } = req.params
    const user = await User.findOne({ username: username })
    const profile = await Profile.findOne({ user: user._id })

    if(!user || !profile){
        res.status(404)
        throw new Error('User not found')
    }

    //grab last 3 reviews
    const reviews = await Review.find({ creator: user.username }).sort({ created_at: -1 }).limit(3)

    //grab last 3 diary entries
    const diaryEntries = profile.diary.sort((a, b) => new Date(b.added_on) - new Date(a.added_on))
    const fullDiaryEntries = await mapGrabMovie(diaryEntries)

    //grab favorite films
    const favoriteFilms = profile.favorite_films
    const fullFavoriteFilms = await mapGrabMovie(favoriteFilms)

    //grab stats (watched films, number of unique films in diary, number of lists)
    const stats = {}
    stats['films'] = profile.watched_movies.length
    const uniqueMovieIds = new Set(diaryEntries.map(entry => entry.movie.toString()));
    stats['this_year'] = uniqueMovieIds.size
    stats['lists'] = await List.countDocuments({ creator: username })
    
    res.json({
        profile: profile,
        reviews: reviews,
        diary: fullDiaryEntries,
        favorite_films: fullFavoriteFilms,
        stats: stats
    })
})

// @desc Get profile sub Data
// route GET api/profile/get_profile_sub_data
// @access Public
const getProfileSubData = asyncHandler(async(req, res) => {
    const { username, category } = req.params
    const user = await User.findOne({ username: username })
    const profile = await Profile.findOne({ user: user._id })

    if(!user || !profile){
        res.status(404)
        throw new Error('User not found')
    }

    if(category === 'diary'){
        const diaryEntries = profile.diary.sort((a, b) => new Date(b.added_on) - new Date(a.added_on))
        const fullDiaryEntries = await mapGrabMovie(diaryEntries)
        res.json(fullDiaryEntries)
        return
    } else if(category === 'watched'){
        const watchedMovies = profile.watched_movies.sort((a, b) => new Date(b.added_on) - new Date(a.added_on))
        const fullWatchedMovies = await mapGrabMovie(watchedMovies)
        res.json(fullWatchedMovies)
        return
    } else if(category === 'watchlist'){
        const watchlist = profile.watchlist.sort((a, b) => new Date(b.added_on) - new Date(a.added_on))
        const fullWatchlist = await mapGrabMovie(watchlist)
        res.json(fullWatchlist)
        return
    } else if(category === 'likes') {
        const likedMovies = profile.liked_movies.sort((a, b) => new Date(b.added_on) - new Date(a.added_on))
        const fullLikedMovies = await mapGrabMovie(likedMovies)
        res.json(fullLikedMovies)
        return
    } else if(category === 'reviews'){
        const reviews = await Review.find({ creator: username }).sort({ created_at: -1 })
        const fullReviews = await mapGrabMovie(reviews)
        res.json(fullReviews)
        return
    } else if(category === 'lists'){
        const lists = await List.find({ creator: username }).sort({ created_at: -1 })
        const arr = []
        for(const list of lists){
            //grab movie data for each list
            const fullListItems = await mapGrabMovie(list.list_items)
            list.toObject()
            list['list_items'] = fullListItems
            arr.push(list)
        }
        res.json(arr)
        return
    }

    res.json('hooked up')
})

// @desc Update Profile (username)
// route PUT api/profile/update_profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
    const { new_username } = req.body
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    const usernameValidation = validateUsername(new_username)
    if (!usernameValidation.isValid){
        res.status(400)
        throw new Error(usernameValidation.error)
    }
    
    //Check if user exists
    const userExists = await User.findOne({ username: new_username})
    if(userExists){
        res.status(400)
        throw new Error('Username already taken')
    }

    //update username
    user.username = new_username
    await user.save()

    res.json({ new_username: user.username })
})

// @desc Add favorite film to profile
// route POST api/profile/add_favorite_film
// @access Private
const addFavoriteFilm = asyncHandler(async (req, res) => {
    const { title, id, image, genres, release_date, index } = req.body
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

    //add to profile's favorite films
    if(profile.favorite_films.length < 4){
        profile.favorite_films.push({
            movie: movie._id,
            id: movie.id
        })
        await profile.save()
        res.json(`${movie.title} added to ${user.username}'s favorite films`)
    } else if(index){
        profile.favorite_films[index] = { movie: movie._id, id: movie.id }
        await profile.save()
        res.json(`${movie.title} added to ${user.username}'s favorite films`)
    } else {
        res.status(404)
        throw new Error('Only 4 films can be favorited')
    }
})

// @desc Delete favorite film from profile
// route DELETE api/profile/delete_favorite_film
// @access Private
const deleteFavoriteFilm = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //grab the movie
    const movie = await Movie.findOne({ id: id })
    
    if(!movie){
        res.status(404)
        throw new Error('Error deleting movie')
    }

    //delete from profile's favorite films
    const index = profile.favorite_films.findIndex(item => item.movie._id.toString() === movie._id.toString())
    profile.favorite_films.splice(index, 1)
    await profile.save()

    res.json(`${movie.title} removed from ${user.username}'s watched movies`)
})

export {
    getProfileData,
    getProfileSubData,
    updateProfile,
    addFavoriteFilm,
    deleteFavoriteFilm
}