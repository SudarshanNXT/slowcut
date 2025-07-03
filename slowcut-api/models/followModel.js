import mongoose from "mongoose";

const followSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  followed_on: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Follow = mongoose.model('Follow', followSchema);
export default Follow;
