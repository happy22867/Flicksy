const User = require("../models/User");

// Get user by ID
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "name username bio")
      .populate("following", "name username bio");
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const userToFollow = await User.findById(userId);
    
    if (!currentUser) return res.status(404).json({ message: "Current user not found" });
    if (!userToFollow) return res.status(404).json({ message: "User not found" });

    // Add to following list
    if (!currentUser.following.includes(userId)) {
      currentUser.following.push(userId);
      await currentUser.save();
    }

    // Add to followers list
    if (!userToFollow.followers.includes(currentUserId)) {
      userToFollow.followers.push(currentUserId);
      await userToFollow.save();
    }

    const updatedUser = await User.findById(currentUserId)
      .select("-password")
      .populate("followers", "name username bio")
      .populate("following", "name username bio");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error following user" });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const userToUnfollow = await User.findById(userId);
    
    if (!currentUser) return res.status(404).json({ message: "Current user not found" });
    if (!userToUnfollow) return res.status(404).json({ message: "User not found" });

    // Remove from following list
    currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
    await currentUser.save();

    // Remove from followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUserId);
    await userToUnfollow.save();

    const updatedUser = await User.findById(currentUserId)
      .select("-password")
      .populate("followers", "name username bio")
      .populate("following", "name username bio");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error unfollowing user" });
  }
};

// Update user profile (bio, etc.)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const update = {};
    if (req.body.bio !== undefined) update.bio = req.body.bio;
    if (req.body.username !== undefined && req.body.username.trim()) update.username = req.body.username.trim().toLowerCase();

    const user = await User.findByIdAndUpdate(
      userId,
      update,
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .select("-followers")
      .select("-following");
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};
