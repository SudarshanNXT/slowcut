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
        password
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

export {
    registerUser,
    authUser
}