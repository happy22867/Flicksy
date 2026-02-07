const Notification = require("../models/Notification");
const User = require("../models/User");

// Get all notifications for current user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .populate("triggerUser", "name username _id")
      .populate("postId", "_id text")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      read: false
    });

    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ message: "Error fetching unread count" });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    ).populate("triggerUser", "name username");

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Error marking notification as read" });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error marking all as read" });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndDelete(notificationId);

    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting notification" });
  }
};

// Create notification
exports.createNotification = async (userId, triggerUserId, type, postId, message) => {
  try {
    // Allow self-notifications for post creation, but not for likes/comments
    if (userId === triggerUserId && type !== 'post') return;

    const notification = new Notification({
      userId,
      triggerUser: triggerUserId,
      postId,
      type,
      message
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};
