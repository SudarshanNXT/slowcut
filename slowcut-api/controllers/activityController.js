import asyncHandler from "express-async-handler";
import Activity from "../models/activityModel.js";

// @desc Get activity feed for user
// route GET /api/activity
export const getUserActivityFeed = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ user: req.user._id })
    .sort({ created_at: -1 })
    .limit(30)
    .populate({
      path: 'triggered_by',
      select: 'username profile',
      populate: {
        path: 'profile',
        select: 'avatar_url name'
      }
    });

  res.status(200).json(activities);
});

// @desc Mark all activities as seen
// route PATCH /api/activity/seen
export const markAllSeen = asyncHandler(async (req, res) => {
  await Activity.updateMany(
    { user: req.user._id, seen: false },
    { $set: { seen: true } }
  );

  res.status(200).json({ message: "All activities marked as seen" });
});

// Optional: Delete all activity for a user
// route DELETE /api/activity
export const clearActivityFeed = asyncHandler(async (req, res) => {
  await Activity.deleteMany({ user: req.user._id });

  res.status(200).json({ message: "Activity feed cleared." });
});
