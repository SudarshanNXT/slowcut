import asyncHandler from "express-async-handler"
import User from '../../models/userModel.js'
import Profile from "../../models/profileModel.js"
import Movie from "../../models/movieModel.js"
import List from "../../models/listModel.js"
import listStatusArr from "../../utils/listStatusArr.js"

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
    getProfileData,
}