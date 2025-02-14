import asyncHandler from "express-async-handler"
import User from "../../models/userModel.js"
import Profile from "../../models/profileModel.js"
import Movie from "../../models/movieModel.js"
import Review from "../../models/reviewModel.js"

// @desc Create new review
// route POST api/profile/create_review
// @access Private
const createReview = asyncHandler(async (req, res) => {
    const { body, movie_id, title, image, genres, release_date } = req.body
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //check if movie is already in db, if not then create it
    let movie = await Movie.findOne({ id: movie_id })
    if(!movie){
        movie = await Movie.create({
            title: title,
            id: movie_id,
            image: image,
            genres: genres,
            release_date: release_date
        })
    }

    //create review
    const review = await Review.create({
        creator: user.username,
        body: body,
        movie: movie._id
    }) 

    res.json(review)
})

// @desc Update a review
// route PUT api/profile/update_review
// @access Private
const updateReview = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { body } = req.body
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //grab the review
    const review = await Review.findById(id)

    if(!review){
        res.status(404)
        throw new Error('Error finding review')
    }

    //update the review body
    review.body = body
    await review.save()
    res.json('Review updated successfully')
})

// @desc Delete a review
// route DELETE api/profile/delete_review
// @access Private
const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //grab the review
    const review = await Review.findById(id)
    if(!review){
        res.status(404)
        throw new Error('Error finding review')
    }

    //check if creator is the request user
    if(review.creator !== user.username){
        res.status(401)
        throw new Error('Not Authorized')
    }

    await review.deleteOne()
    res.json('Review deleted successfully')
})

// @desc Get reviews for specific creator
// route GET api/profile/get_reviews
// @access Public
const getReviews = asyncHandler(async (req, res) => {
    const { username } = req.params

    //grab the user and their profile
    const user = await User.findOne({ username: username })
    const profile = await Profile.findOne({ user: user._id })

    if(!user || !profile){
        res.status(404)
        throw new Error('User not found')
    }

    //grab reviews
    const reviews = await Review.find({ creator: username })
    res.json(reviews)
})

// @desc Get a single review
// route GET api/profile/get_review
// @access Public
const getReview = asyncHandler(async (req, res) => {
    const { id } = req.params

    //grab the review
    const review = await Review.findById(id)

    //grab the movie data
    const movie = await Movie.findById(review.movie)

    if(!review || !movie){
        res.status(404)
        throw new Error('User not found')
    }

    const reviewObj = review.toObject()
    reviewObj.movie = movie

    //grab the review creators rating and like status for movie
    const reviewCreator = await User.findOne({ username: review.creator })
    const profile = await Profile.findOne({user: reviewCreator._id})

    const likedMovieStatus = profile.liked_movies.some(item => item.movie._id.toString() === movie._id.toString())
    const ratingIndex = profile.watched_movies.findIndex(item => item.movie._id.toString() === movie._id.toString())
    const ratingStatus = ratingIndex !== -1 ? profile.watched_movies[ratingIndex].rating : null
    const rewatchIndex = profile.diary.findIndex(item => item.movie._id.toString() === movie._id.toString())
    const rewatchStatus = rewatchIndex !== -1 ? profile.diary[rewatchIndex].rewatch : null
    const rewatchEntryId = profile.diary[rewatchIndex]._id

    reviewObj.like_status = likedMovieStatus
    reviewObj.rating = ratingStatus
    reviewObj.rewatch_status = rewatchStatus
    reviewObj.rewatch_entry_id = rewatchEntryId

    res.json(reviewObj)
})

export {
    createReview,
    updateReview,
    deleteReview,
    getReviews,
    getReview
}