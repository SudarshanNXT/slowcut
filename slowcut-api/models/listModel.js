import mongoose from "mongoose";

// Comment Subdocument Schema
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  added_on: {
    type: Date,
    default: Date.now
  }
}, { _id: true }); // Ensure _id for individual comment

// Like Subdocument Schema
const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  liked_on: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

// List Item Subdocument Schema
const listItemSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'list_items.type'
  },
  type: {
    type: String,
    required: true,
    enum: ['Movie']
  },
  id: {
    type: String,
    required: true
  },
  added_on: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

// Main List Schema
const listModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String
  },
  creator: {
    type: String,
    required: true
  },
  ranked: {
    type: Boolean,
    default: false
  },
  is_public: {
    type: Boolean,
    default: true
  },
  comments: [commentSchema],
  likes: [likeSchema],
  list_items: [listItemSchema],
  created_at: {
    type: Date,
    default: Date.now
  }
});

const List = mongoose.model('List', listModelSchema);

export default List;
