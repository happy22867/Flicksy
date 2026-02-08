import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaUserPlus, FaBell, FaPlusCircle } from 'react-icons/fa';
import { useNotifications } from '../context/NotificationContext';
import '../styles/Notifications.css';

const Notifications = () => {
  const { notifications, markRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <FaHeart />;
      case 'comment': return <FaComment />;
      case 'follow': return <FaUserPlus />;
      case 'post': return <FaPlusCircle />;
      default: return <FaBell />;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'like': return '#ef4444';
      case 'comment': return '#3b82f6';
      case 'follow': return '#10b981';
      case 'post': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const formatNotificationTime = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    // For older notifications, show full date
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatMessage = (notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.message} ❤️`;
      case 'comment':
        return `${notification.message} 💬`;
      case 'follow':
        return `${notification.message} 👤`;
      case 'post':
        return `${notification.message} 📝`;
      default:
        return notification.message;
    }
  };

  return (
    <motion.div
      className="notifications-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="notifications-header">
        <h2>Notifications</h2>
        <p className="notifications-subtitle">Stay updated with your latest activity</p>
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <div className="no-notifications-icon">🔔</div>
          <h3>No notifications yet</h3>
          <p>When someone interacts with your posts, you'll see it here!</p>
        </div>
      ) : (
        <div className="notifications-list">
          {[...notifications].reverse().map((n) => (
            <motion.div
              key={n.id}
              className={`notification-item ${n.read ? 'read' : 'unread'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => !n.read && markRead(n.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="notification-icon"
                style={{ color: getIconColor(n.type) }}
              >
                {getIcon(n.type)}
              </div>
              <div className="notification-content">
                <p className="notification-message">{formatMessage(n)}</p>
                <span className="notification-time">
                  {formatNotificationTime(n.createdAt)}
                </span>
              </div>
              {!n.read && <div className="unread-indicator" />}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Notifications;
