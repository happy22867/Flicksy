import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaTrash, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { likePost, commentPost, deletePost, followUser, unfollowUser } from '../context/api';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import '../styles/PostCard.css';

const getAuthor = (post) => post.author || post.user;
const getImages = (post) => {
  if (post.images && Array.isArray(post.images) && post.images.length > 0) return post.images;
  if (post.image) return [post.image];
  return [];
};
const isPostLikedByUser = (post, userId) => {
  if (!userId || !post.likes || !post.likes.length) return false;
  const id = typeof userId === 'string' ? userId : userId?.toString?.();
  return post.likes.some((l) => String(l.userId) === id);
};

const PostCard = ({ post, onUpdate, index = 0 }) => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const author = getAuthor(post);
  const images = getImages(post);
  const currentUserId = user?._id ?? user?.id;

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(isPostLikedByUser(post, currentUserId));
  const [likesCount, setLikesCount] = useState(Array.isArray(post.likes) ? post.likes.length : 0);
  const [comments, setComments] = useState(Array.isArray(post.comments) ? post.comments : []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    setIsLiked(isPostLikedByUser(post, currentUserId));
    setLikesCount(Array.isArray(post.likes) ? post.likes.length : 0);
    setComments(Array.isArray(post.comments) ? post.comments : []);
  }, [post._id, post.likes, post.comments, currentUserId]);

  const handleLike = async () => {
    const justLiked = !isLiked;
    setIsLiked(justLiked);
    setLikesCount((c) => (justLiked ? c + 1 : c - 1));
    if (justLiked) {
      setFloatingHearts([1, 2, 3]);
      setTimeout(() => setFloatingHearts([]), 700);
      addToast('Liked!', '❤️');
      addNotification({ type: 'like', message: 'You liked a post' });
    }
    try {
      await likePost(post._id);
    } catch (error) {
      setIsLiked(!justLiked);
      setLikesCount((c) => (justLiked ? c - 1 : c + 1));
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const text = newComment.trim();
    setNewComment('');
    const optimisticComment = { _id: 'temp-' + Date.now(), username: user?.name || user?.username || 'You', text };
    setComments((prev) => [...prev, optimisticComment]);
    addToast('Comment posted!', '💬');
    addNotification({ type: 'comment', message: 'You commented on a post' });
    try {
      const response = await commentPost(post._id, text);
      const updated = response.data?.comments ?? [...comments, optimisticComment];
      setComments(updated);
    } catch (error) {
      setComments((prev) => prev.filter((c) => c._id !== optimisticComment._id));
      setNewComment(text);
      console.error('Error commenting:', error);
    }
  };

  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deletePost(post._id);
      onUpdate?.();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setDeleting(false);
    }
  };

  const isAuthor = author?.userId?.toString() === currentUserId?.toString() || author?.userId === currentUserId;
  const authorId = author?.userId || author?._id;
  const isFollowingAuthor = user?.following?.some(f => String(f._id || f) === String(authorId));

  const handleFollowAuthor = async () => {
    if (!authorId || followLoading) return;
    setFollowLoading(true);
    try {
      const response = await followUser(authorId);
      updateUser(response.data);
      addToast(`Following ${author?.username || author?.name}!`, '👤');
      addNotification({ type: 'follow', message: `You started following ${author?.username || author?.name}` });
    } catch (error) {
      console.error('Follow error:', error);
      addToast('Failed to follow', '❌');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollowAuthor = async () => {
    if (!authorId || followLoading) return;
    setFollowLoading(true);
    try {
      const response = await unfollowUser(authorId);
      updateUser(response.data);
      addToast(`Unfollowed ${author?.username || author?.name}`, '👋');
    } catch (error) {
      console.error('Unfollow error:', error);
      addToast('Failed to unfollow', '❌');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleAuthorClick = () => {
    if (authorId) {
      navigate(`/profile/${authorId}`);
    }
  };

  const formatDate = (date) => {
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
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  return (
    <motion.article
      className="post-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
    >
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar" onClick={handleAuthorClick} style={{ cursor: 'pointer' }}>
            {(author?.username || author?.name || '?').charAt(0).toUpperCase()}
          </div>
          <div className="author-info">
            <h4 onClick={handleAuthorClick} style={{ cursor: 'pointer', color: 'var(--primary-color)' }}>
              {author?.username || author?.name || 'Unknown'}
            </h4>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
          {!isAuthor && authorId && (
            <button
              type="button"
              className={`follow-author-btn ${isFollowingAuthor ? 'following' : ''}`}
              onClick={isFollowingAuthor ? handleUnfollowAuthor : handleFollowAuthor}
              disabled={followLoading}
            >
              {followLoading ? '...' : (
                <>
                  {isFollowingAuthor ? <FaUserCheck /> : <FaUserPlus />}
                  <span>{isFollowingAuthor ? 'Following' : 'Follow'}</span>
                </>
              )}
            </button>
          )}
          {isAuthor && (
            <button type="button" className="btn-delete" onClick={handleDeleteClick} aria-label="Delete post">
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      {post.text && <p className="post-text">{post.text}</p>}

      {images.length > 0 && (
        <div className="post-images">
          {images.map((image, i) => (
            <img key={i} src={image} alt={`Post ${i + 1}`} loading="lazy" />
          ))}
        </div>
      )}

      <div className="post-actions">
        <div className="like-btn-wrapper">
          {floatingHearts.map((_, i) => (
            <motion.span
              key={i}
              className="floating-heart"
              initial={{ opacity: 1, y: 0, x: (i - 1) * 12 }}
              animate={{ opacity: 0, y: -70, x: (i - 1) * 20 }}
              transition={{ duration: 0.6 }}
            >
              ❤️
            </motion.span>
          ))}
          <motion.button
            type="button"
            className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            whileTap={{ scale: 0.92 }}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
            <span>{likesCount}</span>
          </motion.button>
        </div>
        <motion.button
          type="button"
          className={`action-btn comment-btn ${showComments ? 'active' : ''}`}
          onClick={() => setShowComments(!showComments)}
          whileTap={{ scale: 0.95 }}
        >
          <FaComment />
          <span>{comments.length}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            className="comments-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="comments-list">
              {comments.map((comment, idx) => (
                <div key={comment._id || idx} className="comment">
                  <strong>{comment.username || comment.user?.username || 'User'}</strong>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleComment} className="comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <button type="submit">Post</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete post?"
        message="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => !deleting && setShowDeleteModal(false)}
        danger
      />
    </motion.article>
  );
};

export default PostCard;
