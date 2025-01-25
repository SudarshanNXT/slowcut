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
    reviewObj['movie'] = movie

    res.json(reviewObj)
})

export {
    createReview,
    updateReview,
    deleteReview,
    getReviews,
    getReview
}