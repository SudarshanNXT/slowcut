import mongoose from "mongoose"

const reviewModelSchema = mongoose.Schema({
    creator: {
        type: String
    },
    body: {
        type: String,
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now 
    }
})

const Review = mongoose.model('Review', reviewModelSchema)

export default Review