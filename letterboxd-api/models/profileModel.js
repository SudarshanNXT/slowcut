import mongoose from "mongoose"

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
        unique: true // Ensures one profile per user
    },
    liked_movies: [{
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'liked_movies.type'
        },
        id: {
            type: Number,
            required: true
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }],
    watched_movies: [{
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'watched_movies.type'
        },
        id: {
            type: Number,
            required: true
        },
        rating: {
            type: Number,
            default: null
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }],
    watchlist: [{
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'watchlist.type'
        },
        id: {
            type: Number,
            required: true
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }],
    diary: [{
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'watchlist.type'
        },
        id: {
            type: Number,
            required: true
        },
        added_on: {
            type: Date,
            default: Date.now
        },
        rewatch: {
            type: Boolean,
            default: false
        },
    }]
})

const Profile = mongoose.model('Profile', profileSchema)

export default Profile