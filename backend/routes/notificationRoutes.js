const express = require("express");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notifications (protected)
router.get("/", authMiddleware, getNotifications);

// Get unread count (protected)
router.get("/unread/count", authMiddleware, getUnreadCount);

// Mark notification as read (protected)
router.put("/:notificationId/read", authMiddleware, markAsRead);

// Mark all as read (protected)
router.put("/read/all", authMiddleware, markAllAsRead);

// Delete notification (protected)
router.delete("/:notificationId", authMiddleware, deleteNotification);

module.exports = router;
