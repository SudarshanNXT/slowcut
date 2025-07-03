import mongoose from "mongoose";

const profileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true, // <-- Add this
    index: true
  },
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  liked_movies: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Movie'
    },
    id: {
      type: Number,
      required: true
    },
    added_on: {
      type: Date,
      default: Date.now
    }
  }],
  watched_movies: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Movie'
    },
    id: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      default: null
    },
    added_on: {
      type: Date,
      default: Date.now
    }
  }],
  watchlist: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Movie'
    },
    id: {
      type: Number,
      required: true
    },
    added_on: {
      type: Date,
      default: Date.now
    }
  }],
  favorite_films: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Movie'
    },
    id: {
      type: Number,
      required: true
    },
    added_on: {
      type: Date,
      default: Date.now
    }
  }],
  diary: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Movie'
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
    }
  }]
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
