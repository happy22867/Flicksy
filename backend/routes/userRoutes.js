const express = require("express");
const { 
  getUserProfile, 
  followUser, 
  unfollowUser, 
  updateProfile,
  getAllUsers 
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all users
router.get("/", getAllUsers);

// Get user profile by ID
router.get("/:id", getUserProfile);

// Follow user (protected)
router.post("/:userId/follow", authMiddleware, followUser);

// Unfollow user (protected)
router.delete("/:userId/follow", authMiddleware, unfollowUser);

// Update profile (protected)
router.put("/update/profile", authMiddleware, updateProfile);

module.exports = router;
