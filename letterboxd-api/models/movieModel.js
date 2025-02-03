import mongoose from "mongoose"

const movieSchema = mongoose.Schema({
    title: {
        type: String
    },
    id: {
        type: Number,
        unique: true
    },
    image: {
        type: String
    },
    release_date: {
        type: String
    },
    genres: [
        {
            id: {
                type: Number
            },
            name: {
                type: String
            }
        }
    ],
    type: {
        type: String,
        default: 'Movie'
    }
})

const Movie = mongoose.model('Movie', movieSchema)

export default Movie