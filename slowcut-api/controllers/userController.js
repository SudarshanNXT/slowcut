import asyncHandler from "express-async-handler";
import User from '../models/userModel.js';
import generateToken from "../utils/generateToken.js";
import { validateUserInput } from '../utils/inputValidation.js';
import Profile from "../models/profileModel.js";
import List from "../models/listModel.js";
import Review from "../models/reviewModel.js";

// Register new user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, confirm_password } = req.body;

  const inputValidation = validateUserInput(username, password, confirm_password);
  if (!inputValidation.isValid) {
    res.status(400);
    throw new Error(inputValidation.error);
  }

  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    res.status(400);
    throw new Error(userExists.username === username
      ? 'Username already taken'
      : 'Email already registered');
  }

  // Create user
  const user = await User.create({ username, email, password });

  if (user) {
    // ✅ Create profile (include username!)
    const profile = await Profile.create({
      user: user._id,
      username,         // <-- Important
      email,
      name: username,
      bio: '',
    });

    user.profile = profile._id;
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      username,
      email,
      token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Authenticate and login user
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPasswords(password))) {
    let profile = await Profile.findOne({ user: user._id });

    if (!profile) {
      // Fallback: Create profile if not found
      profile = await Profile.create({
        user: user._id,
        username,        // <-- Ensure it's set
        email: user.email,
        name: username,
        bio: '',
      });

      user.profile = profile._id;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      username,
      email: user.email,
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// Delete profile and related data
const deleteProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const profile = await Profile.findOne({ user: user._id });

  if (!user || !profile) {
    res.status(400);
    throw new Error('Error deleting profile');
  }

  await List.deleteMany({ creator: user.username });
  await Review.deleteMany({ creator: user.username });
  await Profile.deleteOne({ _id: profile._id });
  await User.deleteOne({ _id: user._id });

  res.json('Successfully deleted user');
});

// Token check for frontend session validation
const checkToken = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json('check token');
  } else {
    res.status(404);
    throw new Error('Token not validated successfully');
  }
});

export {
  registerUser,
  authUser,
  deleteProfile,
  checkToken
};
