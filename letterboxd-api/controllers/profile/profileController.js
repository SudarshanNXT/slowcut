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
    const fullDiaryEntries = await Promise.all(
        diaryEntries.slice(0, 3).map(async diary_entry => {
            const movie = await Movie.findById(diary_entry.movie)
            diary_entry['movie'] = movie
            return diary_entry
        })
    ) 

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

export {
    getProfileData,
    getProfileSubData,
    updateProfile
}