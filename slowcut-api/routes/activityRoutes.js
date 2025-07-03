import express from "express";
import {
  getUserActivityFeed,
  markAllSeen,
  clearActivityFeed
} from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserActivityFeed);
router.patch("/seen", protect, markAllSeen);
router.delete("/", protect, clearActivityFeed); // Optional

export default router;
