import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import Profile from "../../models/profileModel.js";
import Movie from "../../models/movieModel.js";
import Review from "../../models/reviewModel.js";
import logActivity from "../../utils/logActivity.js";
import Follow from "../../models/followModel.js";
// @desc Create new review
// route POST api/profile/create_review
// @access Private
const createReview = asyncHandler(async (req, res) => {
  const { body, movie_id, title, image, genres, release_date } = req.body;
  const user = await User.findById(req.user._id);
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile || !user) {
    res.status(404);
    throw new Error("User not found");
  }

  let movie = await Movie.findOne({ id: movie_id });
  if (!movie) {
    movie = await Movie.create({
      title: title,
      id: movie_id,
      image: image,
      genres: genres,
      release_date: release_date
    });
  }

  const review = await Review.create({
    creator: user.username,
    body: body,
    movie: movie._id
  });

  const followers = await Profile.find({});
  for (const follower of followers) {
    const isFollowing = follower.watchlist.some(item => item.movie.toString() === movie._id.toString());
    if (isFollowing || follower._id.toString() !== profile._id.toString()) {
      await logActivity({
        userId: follower.user,
        triggeredById: user._id,
        type: "NEW_REVIEW",
        targetId: review._id,
        targetModel: "Review"
      });
    }
  }

  res.json(review);
});

const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;
  const user = await User.findById(req.user._id);
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile || !user) {
    res.status(404);
    throw new Error("User not found");
  }

  const review = await Review.findById(id);

  if (!review) {
    res.status(404);
    throw new Error("Error finding review");
  }

  review.body = body;
  await review.save();
  res.json("Review updated successfully");
});

const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile || !user) {
    res.status(404);
    throw new Error("User not found");
  }

  const review = await Review.findById(id);
  if (!review) {
    res.status(404);
    throw new Error("Error finding review");
  }

  if (review.creator !== user.username) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  await review.deleteOne();
  res.json("Review deleted successfully");
});

const getReviews = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });
  const profile = await Profile.findOne({ user: user._id });

  if (!user || !profile) {
    res.status(404);
    throw new Error("User not found");
  }

  const reviews = await Review.find({ creator: username });
  res.json(reviews);
});

const getReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  const movie = await Movie.findById(review.movie);

  if (!review || !movie) {
    res.status(404);
    throw new Error("User not found");
  }

  const reviewObj = review.toObject();
  reviewObj.movie = movie;

  const reviewCreator = await User.findOne({ username: review.creator });
  const profile = await Profile.findOne({ user: reviewCreator._id });

  const likedMovieStatus = profile.liked_movies.some(item => item.movie._id.toString() === movie._id.toString());
  const ratingIndex = profile.watched_movies.findIndex(item => item.movie._id.toString() === movie._id.toString());
  const ratingStatus = ratingIndex !== -1 ? profile.watched_movies[ratingIndex].rating : null;
  const rewatchIndex = profile.diary.findIndex(item => item.movie._id.toString() === movie._id.toString());
  const rewatchStatus = rewatchIndex !== -1 ? profile.diary[rewatchIndex].rewatch : null;
  const rewatchEntryId = rewatchIndex !== -1 ? profile.diary[rewatchIndex]._id : null;

  reviewObj.like_status = likedMovieStatus;
  reviewObj.rating = ratingStatus;
  reviewObj.rewatch_status = rewatchStatus;
  reviewObj.rewatch_entry_id = rewatchEntryId;

  res.json(reviewObj);
});

const likeReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new Error("Review not found");

  const alreadyLiked = review.likes.some(like => like.user.toString() === req.user._id.toString());
  if (alreadyLiked) {
    res.status(400);
    throw new Error("You have already liked this review");
  }

  review.likes.push({ user: req.user._id });
  await review.save();

  const creatorUser = await User.findOne({ username: review.creator });
  if (creatorUser._id.toString() !== req.user._id.toString()) {
    await logActivity({
      userId: creatorUser._id,
      triggeredById: req.user._id,
      type: "REVIEW_LIKE",
      targetId: review._id,
      targetModel: "Review"
    });
  }

  res.status(201).json({ message: "Review liked" });
});

const unlikeReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new Error("Review not found");

  const index = review.likes.findIndex(like => like.user.toString() === req.user._id.toString());

  if (index === -1) {
    res.status(400);
    throw new Error("You haven't liked this review");
  }

  review.likes.splice(index, 1);
  await review.save();

  res.json({ message: "Review unliked", likes: review.likes.length });
});

const getReviewLikes = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new Error("Review not found");

  const isLiked = review.likes.some(like => like.user.toString() === req.user._id.toString());
  res.json({ likes: review.likes.length, isLiked });
});

const addReviewComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) throw new Error("Review not found");

  review.comments.push({ user: req.user._id, comment });
  await review.save();

  const creatorUser = await User.findOne({ username: review.creator });
  if (creatorUser._id.toString() !== req.user._id.toString()) {
    await logActivity({
      userId: creatorUser._id,
      triggeredById: req.user._id,
      type: "REVIEW_COMMENT",
      targetId: review._id,
      targetModel: "Review"
    });
  }

  res.status(201).json({ message: "Comment added" });
});

const getReviewComments = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate("comments.user", "username");
  if (!review) throw new Error("Review not found");

  res.json(review.comments);
});

const deleteReviewComment = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new Error("Review not found");

  const commentIndex = review.comments.findIndex(c => c._id.toString() === req.params.commentId);

  if (commentIndex === -1) throw new Error("Comment not found");

  const comment = review.comments[commentIndex];
  const isOwner = comment.user.toString() === req.user._id.toString();
  const isCreator = review.creator === req.user.username;

  if (!isOwner && !isCreator) {
    res.status(403);
    throw new Error("Not authorized to delete this comment");
  }

  review.comments.splice(commentIndex, 1);
  await review.save();

  res.status(200).json({ message: "Comment deleted" });
});

const getReviewLikeCommentCounts = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new Error("Review not found");

  res.json({ likes: review.likes.length, comments: review.comments.length });
});
const getTrendingReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('movie')
    .populate('creator', 'username');

  const filtered = reviews.filter(r => r.movie && r.creator);

  const sorted = filtered
    .map(review => {
      const likes = Array.isArray(review.likes) ? review.likes.length : 0;
      const comments = Array.isArray(review.comments) ? review.comments.length : 0;

      return {
        _id: review._id,
        movie: review.movie,
        creator: review.creator.username || review.creator,
        content: review.body,
        rating: review.rating,
        likes,
        comments,
        totalEngagement: likes + comments,
        created_at: review.created_at,
      };
    })
    .sort((a, b) => b.totalEngagement - a.totalEngagement)
    .slice(0, 50);

  res.status(200).json({ count: sorted.length, trendingReviews: sorted });
});

const getFollowingUsersReviews = asyncHandler(async (req, res) => {
  const currentProfileId = req.user.profileId;

  const followingRelations = await Follow.find({ follower: currentProfileId });
  const followingProfileIds = followingRelations.map(f => f.following);

  const followingUsers = await User.find({ profile: { $in: followingProfileIds } });
  const followingUsernames = followingUsers.map(u => u.username);

  const reviews = await Review.find({ creator: { $in: followingUsernames } })
    .populate('movie')
    .sort({ created_at: -1 })
    .limit(50);

  res.status(200).json({ count: reviews.length, reviews });
});

export {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
  getReview,
  likeReview,
  unlikeReview,
  getReviewLikes,
  addReviewComment,
  getReviewComments,
  deleteReviewComment,
  getReviewLikeCommentCounts,
  getFollowingUsersReviews,
  getTrendingReviews
};