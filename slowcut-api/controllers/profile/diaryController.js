import asyncHandler from "express-async-handler"
import User from "../../models/userModel.js"
import Profile from "../../models/profileModel.js"
import Movie from "../../models/movieModel.js"
import Review from "../../models/reviewModel.js"
import List from "../../models/listModel.js"

// @desc Add diary entry to profile
// route POST api/profile/add_diary_entry
// @access Private
const addDiaryEntry = asyncHandler(async (req, res) => {
    const { id, title, image, genres, release_date, rewatch } = req.body
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

    //add to profile (diary)
    profile.diary.push({
        movie: movie._id,
        id: movie.id,
        rewatch: rewatch
    })
    await profile.save()

    res.json(`${movie.title} added to diary`)
})

// @desc Update diary entry
// route PUT api/profile/update_diary_entry
// @access Private
const updateDiaryEntry = asyncHandler(async (req, res) => {
    const { entry_id } = req.params
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //find the index of the entry and update rewatched field
    const index = profile.diary.findIndex(entry => entry._id.toString() === entry_id)
    profile.diary[index].rewatch = !profile.diary[index].rewatch
    await profile.save()

    res.json(`Diary entry updated at index ${index}`)
})

// @desc Delete diary entry
// route DELETE api/profile/delete_diary_entry
// @access Private
const deleteDiaryEntry = asyncHandler(async (req, res) => {
    const { entry_id } = req.params
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //find the index and delete entry
    const index = profile.diary.findIndex(entry => entry._id.toString() === entry_id.toString())
    if(index !== -1){
        profile.diary.splice(index, 1)
    } else {
        throw new Error('Error deleting diary entry')
    }
    
    await profile.save()

    res.json(`Diary entry removed at index ${index}`)
})

// @desc Get diary data
// route GET api/profile/get_diary_data
// @access Private
const getDiaryData = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    const arr = []

    //iterate through diary entries: grab the movie, check rating, like status, review status
    for(const entry of profile.diary){
        const obj = {}
        obj['id'] = entry.id
        obj['_id'] = entry._id
        obj['added_on'] = entry.added_on
        obj['rewatch'] = entry.rewatch

        //grab the movie
        const movie = await Movie.findById(entry.movie) 
        const movieObject = movie.toObject()
        obj['movie'] = movieObject

        //check like status
        const likeStatus = profile.liked_movies.some(item => item.movie._id.toString() === movie._id.toString())
        obj['like_status'] = likeStatus

        //check review status
        const reviewCheck = await Review.findOne({ creator: user.username, movie: movie._id })
        const reviewStatus = reviewCheck ? true : false
        obj['review_status'] = reviewStatus

        //check rating
        const ratingIndex = profile.watched_movies.findIndex(item => item.movie._id.toString() === movie._id.toString())
        const rating = ratingIndex !== -1 ? profile.watched_movies[ratingIndex].rating : null
        obj['rating'] = rating

        arr.push(obj)
    }

    res.json(arr)
})

export {
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    getDiaryData
}