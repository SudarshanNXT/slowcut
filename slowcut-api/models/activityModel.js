import mongoose from "mongoose";

const activitySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // the user who receives the notification
    required: true
  },
  triggered_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // the user who caused the activity
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'FOLLOW',
      'LIST_LIKE',
      'LIST_COMMENT',
      'REVIEW_LIKE',
      'REVIEW_COMMENT',
      'NEW_LIST',
      'NEW_REVIEW',
      'LIKE_MOVIE',
      'WATCH_MOVIE',
      'WISHLIST_MOVIE',
      'SIMILAR_MOVIE_ACTION'
    ]
  },
  target_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  target_model: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  seen: {
    type: Boolean,
    default: false
  }
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
