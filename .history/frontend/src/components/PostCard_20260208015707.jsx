import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { likePost, commentPost, deletePost } from '../../context/api';
import '../styles/PostCard.css';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes.includes(user._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = async () => {
    try {
      await likePost(post._id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      onUpdate();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await commentPost(post._id, newComment);
      setComments([...comments, response.data]);
      setNewComment('');
      onUpdate();
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post._id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div 
      className="post-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">
            {post.author?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="author-info">
            <h4>{post.author?.username}</h4>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        {post.author?._id === user._id && (
          <button className="btn-delete" onClick={handleDelete}>
            <FaTrash />
          </button>
        )}
      </div>

      {post.text && <p className="post-text">{post.text}</p>}

      {post.images && post.images.length > 0 && (
        <div className="post-images">
          {post.images.map((image, index) => (
            <img key={index} src={image} alt={`Post ${index + 1}`} />
          ))}
        </div>
      )}

      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`} 
          onClick={handleLike}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>{likesCount}</span>
        </button>
        <button 
          className="action-btn" 
          onClick={() => setShowComments(!showComments)}
        >
          <FaComment />
          <span>{comments.length}</span>
        </button>
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
              {comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <strong>{comment.user?.username}</strong>
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
    </motion.div>
  );
};

export default PostCard;
