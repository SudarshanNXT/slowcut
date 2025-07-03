import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import Profile from "../../models/profileModel.js";
import Movie from "../../models/movieModel.js";
import List from "../../models/listModel.js";
import logActivity from "../../utils/logActivity.js";
import listStatusArr from "../../utils/listStatusArr.js";
import { getGenreObjects } from "../../utils/getGenres.js";
import Follow from "../../models/followModel.js";
const createList = asyncHandler(async (req, res) => {
  const { name, description, ranked, is_public, list_items } = req.body;
  const user = await User.findById(req.user._id);
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile || !user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name.length > 100) {
    res.status(400);
    throw new Error('List name too long.');
  }

  const list = await List.create({
    name,
    description,
    creator: user.username,
    ranked,
    is_public,
    comments: [],
    list_items: []
  });

  for (const list_item of list_items) {
    let movie = await Movie.findOne({ id: list_item.id });
    if (!movie) {
      movie = await Movie.create({
        title: list_item.title,
        id: list_item.id,
        image: list_item.poster_path,
        genres: getGenreObjects(list_item.genres),
        release_date: list_item.release_date
      });
    }

    list.list_items.push({
      movie: movie._id,
      type: 'Movie',
      id: movie.id
    });
  }
  await list.save();

  res.json({ list });
});

const updateListData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, ranked, is_public, list_items } = req.body;
  const user = await User.findById(req.user._id);
  const profile = await Profile.findOne({ user: req.user._id });
  const list = await List.findById(id);

  if (!profile || !user || !list) {
    res.status(404);
    throw new Error('User or list not found');
  }

  if (name.length > 50) {
    res.status(400);
    throw new Error('List name too long.');
  }

  list.name = name;
  list.description = description;
  list.ranked = ranked;
  list.is_public = is_public;

  const newListItems = [];
  for (const list_item of list_items) {
    const movie = await Movie.findById(list_item._id);
    const obj = {
      movie: list_item._id,
      type: 'Movie',
      id: movie.id
    };
    newListItems.push(obj);
  }
  list.list_items = newListItems;

  await list.save();
  res.json(`${list.name} updated successfully`);
});

const deleteList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const list = await List.findById(id);
  const listName = list.name;

  if (!list) {
    res.status(404);
    throw new Error('List not found');
  }

  await list.deleteOne();
  res.json(`${listName} deleted successfully`);
});

const addMoviesToLists = asyncHandler(async (req, res) => {
  const { movie_id, list_of_lists, title, id, image, genres, release_date } = req.body;

  let movie = await Movie.findOne({ id: movie_id });
  if (!movie) {
    movie = await Movie.create({
      title,
      id,
      image,
      genres,
      release_date
    });
  }

  for (const list_id of list_of_lists) {
    const list = await List.findById(list_id);
    list.list_items.push({
      movie: movie._id,
      type: 'Movie',
      id: movie.id
    });
    await list.save();
  }

  res.json('Movies added to lists successfully');
});

const removeMovieFromList = asyncHandler(async (req, res) => {
  const { list_id, movie_id } = req.body;
  const user = await User.findById(req.user._id);
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile || !user) {
    res.status(404);
    throw new Error('User not found');
  }

  const list = await List.findById(list_id);
  if (!list) {
    res.status(404);
    throw new Error('List not found');
  }

  if (list.creator !== user.username) {
    res.status(404);
    throw new Error('Unauthorized');
  }

  const movie = await Movie.findById(movie_id);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  const index = list.list_items.findIndex(item => item.movie.toString() === movie._id.toString());
  if (index !== -1) {
    list.list_items.splice(index, 1);
    await list.save();
  }

  res.json(`${movie.title} removed from ${list.name}`);
});

const getListData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const list = await List.findById(id);

  if (!list) {
    res.status(404);
    throw new Error('List not found');
  }

  const arr = [];
  for (const [index, item] of list.list_items.entries()) {
    const movie = await Movie.findById(item.movie);
    const movieObject = movie.toObject();
    movieObject.added_on = item.added_on;
    movieObject.order = index;
    arr.push(movieObject);
  }

  res.json({ list, movies: arr });
});

const getLikes = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);
  if (!list) {
    res.status(404);
    throw new Error('List not found');
  }

  const isLiked = list.likes.some(like => like.user.toString() === req.user._id.toString());
  res.json({ likes: list.likes.length, isLiked });
});

const likeList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);
  if (!list) {
    res.status(404);
    throw new Error('List not found');
  }

  const alreadyLiked = list.likes.some(like => like.user.toString() === req.user._id.toString());
  if (alreadyLiked) {
    res.status(400);
    throw new Error('Already liked');
  }

  list.likes.push({ user: req.user._id });
  await list.save();

  const creatorUser = await User.findOne({ username: list.creator });
  if (creatorUser._id.toString() !== req.user._id.toString()) {
    await logActivity({
      userId: creatorUser._id,
      triggeredById: req.user._id,
      type: "LIST_LIKE",
      targetId: list._id,
      targetModel: "List"
    });
  }

  res.status(200).json({ message: 'List liked', likes: list.likes.length, isLiked: true });
});

const unlikeList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);
  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  const index = list.likes.findIndex(
    like => like.user.toString() === req.user._id.toString()
  );

  if (index === -1) {
    res.status(400);
    throw new Error("You haven't liked this list");
  }

  list.likes.splice(index, 1);
  await list.save();

  res.status(200).json({ message: "List unliked", likes: list.likes.length, isLiked: false });
});

const getComments = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id).populate('comments.user', 'username');
  if (!list) {
    res.status(404);
    throw new Error('List not found');
  }

  const comments = list.comments.map(comment => ({
    _id: comment._id,
    content: comment.comment,
    username: comment.user.username,
    timeAgo: comment.added_on
  }));

  res.status(200).json({ comments });
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === '') {
    res.status(400);
    throw new Error("Comment cannot be empty");
  }

  const list = await List.findById(req.params.id).populate('comments.user', 'username');
  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  const comment = {
    user: req.user._id,
    comment: content,
    added_on: new Date()
  };

  list.comments.unshift(comment);
  await list.save();

  const creatorUser = await User.findOne({ username: list.creator });
  if (creatorUser._id.toString() !== req.user._id.toString()) {
    await logActivity({
      userId: creatorUser._id,
      triggeredById: req.user._id,
      type: "LIST_COMMENT",
      targetId: list._id,
      targetModel: "List"
    });
  }

  const populatedComment = {
    _id: comment._id,
    content: comment.comment,
    username: req.user.username,
    timeAgo: comment.added_on
  };

  res.status(201).json({ message: 'Comment added', comment: populatedComment });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id: listId, commentId } = req.params;
  const userId = req.user._id;

  const list = await List.findById(listId);
  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  const comment = list.comments.id(commentId);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  if (
    comment.user.toString() !== userId.toString() &&
    list.creator.toString() !== req.user.username
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this comment");
  }

  comment.deleteOne();
  await list.save();

  res.status(200).json({ message: "Comment deleted" });
});

const getLikeCommentCounts = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);
  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  res.json({
    likes: list.likes.length,
    comments: list.comments.length
  });
});


const getFollowingUsersLists = asyncHandler(async (req, res) => {
  const currentProfileId = req.user.profileId;

  // Get all the people this user is following
  const followingRelations = await Follow.find({ follower: currentProfileId });
  const followingProfileIds = followingRelations.map(f => f.following);

  // Get usernames of those users
  const followingUsers = await User.find({ profile: { $in: followingProfileIds } });
  const followingUsernames = followingUsers.map(u => u.username);

  // Get lists created by those usernames and populate movie details
  const lists = await List.find({ creator: { $in: followingUsernames } })
    .populate('list_items.movie') // 🔥 important for frontend to access image, title etc.
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({ count: lists.length, lists });
});
const getTopListsByEngagement = asyncHandler(async (req, res) => {
  const lists = await List.find({ is_public: true })
    .populate('list_items.movie'); // 🔥 needed for movie images in frontend

  const sorted = lists
    .map(list => ({
      _id: list._id,
      name: list.name,
      creator: list.creator,
      list_items: list.list_items, // include full items with movie details
      likes: list.likes.length,
      comments: list.comments.length,
      totalEngagement: list.likes.length + list.comments.length
    }))
    .sort((a, b) => b.totalEngagement - a.totalEngagement)
    .slice(0, 50); // top 50

  res.status(200).json({ count: sorted.length, topLists: sorted });
});


export {
  createList,
  updateListData,
  deleteList,
  addMoviesToLists,
  removeMovieFromList,
  getListData,
  getLikes,
  likeList,
  unlikeList,
  getComments,
  addComment,
  deleteComment,
  getLikeCommentCounts,
  getFollowingUsersLists,
  getTopListsByEngagement
};