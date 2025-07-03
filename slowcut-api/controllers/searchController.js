
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import List from '../models/listModel.js';
import Review from '../models/reviewModel.js';

export const getAllMembersStats = asyncHandler(async (req, res) => {
  const users = await User.find();

  const results = [];

  for (const user of users) {
    const profile = await Profile.findOne({ user: user._id });

    const watched = profile?.watched_movies?.length || 0;
    const lists = await List.countDocuments({ creator: user.username });
    const reviewed = await Review.countDocuments({ creator: user.username });

    results.push({
      username: user.username,
      watched,
      lists,
      reviewed,
    });
  }

  res.json({ results });
});
export const searchMemberUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Search query is required" });
  }

  const users = await User.find({
    username: { $regex: query, $options: "i" },
  });

  const results = [];

  for (const user of users) {
    const profile = await Profile.findOne({ user: user._id });
    results.push({
      username: user.username,
      name: profile?.name || user.username, // fallback if no name
    });
  }

  res.json({ results });
});
