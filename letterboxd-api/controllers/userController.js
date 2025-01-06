import asyncHandler from "express-async-handler"
import User from '../models/userModel.js'
import generateToken from "../utils/generateToken.js"
import validateUserInput from "../utils/inputValidation.js"

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
        password,
        image: '',
        followed_items: [],
        recently_viewed: [],
        liked_songs: []
    })

    if (user) {
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

export {
    registerUser
}