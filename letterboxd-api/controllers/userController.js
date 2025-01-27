import asyncHandler from "express-async-handler"
import User from '../models/userModel.js'
import generateToken from "../utils/generateToken.js"
import { validateUserInput } from '../utils/inputValidation.js'
import Profile from "../models/profileModel.js"
import List from "../models/listModel.js"
import Review from "../models/reviewModel.js"

// @desc Register a new user
// route POST api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, password, confirm_password } = req.body;

    const inputValidation = validateUserInput(username, password, confirm_password)

    if (!inputValidation.isValid){
        res.status(400)
        throw new Error(inputValidation.error)
    }
    
    //Check if user exists
    const userExists = await User.findOne({username})
    if (userExists){
        res.status(400)
        throw new Error('Username already taken')
    }

    //Create user
    const user = await User.create({
        username,
        password
    })

    if (user) {
        //create profile
        const profile = await Profile.create({
            user: user._id,
            liked_movies: [],
            watched_movies: [],
            watchlist: [],
            favorite_films: [],
            diary: []
        })

        const token = generateToken(user._id)
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: token
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc Auth user/set token
// route POST api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({username})

    if (user && (await user.matchPasswords(password))) {
        const token = generateToken(user._id)
        
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: token
        })
    } else {
        res.status(401)
        throw new Error('Invalid username or password')
    }
})

// @desc Delete user with cleanup (Profile)
// route POST api/users/delete_profile
// @access Private
const deleteProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!user || !profile){
        res.status(400)
        throw new Error('Error deleting profile')
    }

    //clean up lists
    await List.deleteMany({ creator: user.username })

    //clean up profile
    await Profile.deleteOne({_id: profile._id})

    //clean up reviews
    await Review.deleteMany({ creator: user.username })

    //delete user
    await User.deleteOne({ _id: user._id })

    res.json('Successfully deleted user')
})

export {
    registerUser,
    authUser,
    deleteProfile
}