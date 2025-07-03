import asyncHandler from "express-async-handler";
import Follow from "../models/followModel.js";
import Profile from "../models/profileModel.js";
import List from "../models/listModel.js";
import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import logActivity from "../utils/logActivity.js";

// Follow a user (by username)
export const followUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const currentProfileId = req.user.profileId;
  const currentUserId = req.user._id;

  const targetProfile = await Profile.findOne({ username });
  if (!targetProfile) {
    res.status(404);
    throw new Error("User not found");
  }

  if (targetProfile._id.equals(currentProfileId)) {
    res.status(400);
    throw new Error("You can't follow yourself");
  }

  const exists = await Follow.findOne({
    follower: currentProfileId,
    following: targetProfile._id
  });

  if (exists) {
    res.status(400);
    throw new Error("Already following this user");
  }

  const follow = await Follow.create({
    follower: currentProfileId,
    following: targetProfile._id
  });

  // Trigger activity for the followed user
  const followedUser = await User.findOne({ profile: targetProfile._id });

  if (followedUser) {
    await logActivity({
      userId: followedUser._id,
      triggeredById: currentUserId,
      type: 'FOLLOW',
      targetId: targetProfile._id,
      targetModel: 'Profile'
    });
  }

  res.status(201).json({ message: 'Followed successfully', data: follow });
});

// Unfollow a user (by username)
export const unfollowUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const currentProfileId = req.user.profileId;

  const targetProfile = await Profile.findOne({ username });
  if (!targetProfile) {
    res.status(404);
    throw new Error("User not found");
  }

  const deleted = await Follow.findOneAndDelete({
    follower: currentProfileId,
    following: targetProfile._id
  });

  if (!deleted) {
    res.status(404);
    throw new Error("Not following this user");
  }

  res.json({ message: 'Unfollowed successfully' });
});

// Get followers and following for a profile (by username)
export const getFollowsByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const profile = await Profile.findOne({ username });
  if (!profile) {
    res.status(404);
    throw new Error("User not found");
  }

  const followers = await Follow.find({ following: profile._id }).populate('follower', 'username name');
  const following = await Follow.find({ follower: profile._id }).populate('following', 'username name');

  res.json({
    followers: followers.map(f => f.follower),
    following: following.map(f => f.following)
  });
});

// Check if logged-in user follows another user (by username)
export const isFollowingUser = asyncHandler(async (req, res) => {
  const currentProfileId = req.user.profileId;
  const { username } = req.params;

  const targetProfile = await Profile.findOne({ username });
  if (!targetProfile) {
    res.status(404);
    throw new Error('User not found');
  }

  const isFollowing = await Follow.exists({
    follower: currentProfileId,
    following: targetProfile._id
  });

  res.json({ isFollowing: !!isFollowing });
});

// Get follower and following count by username
export const getFollowCounts = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const profile = await Profile.findOne({ username });

  if (!profile) {
    res.status(404);
    throw new Error('User not found');
  }

  const [followerCount, followingCount] = await Promise.all([
    Follow.countDocuments({ following: profile._id }),
    Follow.countDocuments({ follower: profile._id })
  ]);

  res.json({ followerCount, followingCount });
});

// Get detailed list of followers or following with stats
export const getFollowListWithStats = asyncHandler(async (req, res) => {
  const { username, type } = req.params; // type = 'followers' or 'following'

  const profile = await Profile.findOne({ username });
  if (!profile) {
    res.status(404);
    throw new Error("User not found");
  }

  let connections = [];

  if (type === "followers") {
    connections = await Follow.find({ following: profile._id }).populate("follower");
  } else if (type === "following") {
    connections = await Follow.find({ follower: profile._id }).populate("following");
  } else {
    res.status(400);
    throw new Error("Invalid type, must be 'followers' or 'following'");
  }

  const result = [];

  for (const follow of connections) {
    const targetProfile = type === "followers" ? follow.follower : follow.following;
    const user = await User.findById(targetProfile.user);
    const watched = targetProfile?.watched_movies?.length || 0;
    const reviewed = await Review.countDocuments({ creator: user.username });
    const lists = await List.countDocuments({ creator: user.username });

    result.push({
      username: user.username,
      name: targetProfile.name || user.username,
      watched,
      reviewed,
      lists,
    });
  }

  res.json({ result });
});
