import mongoose from "mongoose";

const reviewModelSchema = mongoose.Schema({
  creator: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Movie"
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      comment: {
        type: String,
        required: true
      },
      added_on: {
        type: Date,
        default: Date.now
      }
    }
  ],
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      liked_on: {
        type: Date,
        default: Date.now
      }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model("Review", reviewModelSchema);
export default Review;
