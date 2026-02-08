import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { FaImage, FaSmile } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { createPost } from '../context/api';
import '../styles/CreatePost.css';

const CreatePost = ({ onPostCreated, inline = false }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      setError('Max 4 images');
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...newImages]);
    setError('');
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && images.length === 0) {
      setError('Add some text or a photo');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('text', text.trim());
      if (images.length > 0) formData.append('image', images[0].file);
      await createPost(formData);
      
      // Create notification for new post
      addNotification({
        type: 'post',
        message: `You created a new post: "${text.trim().substring(0, 50)}${text.trim().length > 50 ? '...' : ''}"`
      });
      
      setText('');
      setImages([]);
      setShowEmojiPicker(false);
      setExpanded(false);
      onPostCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.name || user?.username || 'You';

  if (inline) {
    return (
      <motion.div
        className="create-post-inline"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="create-post-inline-form">
          <div className="create-post-inline-row">
            <div className="create-post-avatar">
              {(displayName.charAt(0) || '?').toUpperCase()}
            </div>
            <div
              className="create-post-input-wrap"
              onClick={() => !expanded && setExpanded(true)}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setExpanded(true)}
                placeholder="What's on your mind?"
                rows={expanded ? 4 : 1}
                className="create-post-inline-input"
              />
            </div>
          </div>
          <AnimatePresence>
            {(expanded || text || images.length > 0) && (
              <motion.div
                className="create-post-inline-actions"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="create-post-inline-buttons">
                  <label className="inline-action-btn" htmlFor="image-upload-inline">
                    <FaImage />
                    <span>Photo</span>
                    <input
                      ref={fileInputRef}
                      id="image-upload-inline"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button
                    type="button"
                    className="inline-action-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <FaSmile />
                    <span>Emoji</span>
                  </button>
                </div>
                {showEmojiPicker && (
                  <div className="emoji-picker-inline">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
                {images.length > 0 && (
                  <div className="image-preview-inline">
                    {images.map((img, index) => (
                      <div key={index} className="image-preview">
                        <img src={img.preview} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {error && <div className="create-post-inline-error">{error}</div>}
                <div className="create-post-inline-submit">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => {
                      setExpanded(false);
                      setShowEmojiPicker(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-post"
                    disabled={loading || (!text.trim() && images.length === 0)}
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="create-post-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Create a New Post</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="textarea-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows="5"
          />
          <div className="textarea-actions">
            <button type="button" className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <FaSmile />
            </button>
            <label htmlFor="image-upload" className="image-upload-btn">
              <FaImage />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        {images.length > 0 && (
          <div className="image-preview-container">
            {images.map((img, index) => (
              <div key={index} className="image-preview">
                <img src={img.preview} alt={`Preview ${index + 1}`} />
                <button type="button" className="remove-image" onClick={() => removeImage(index)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </motion.div>
  );
};

export default CreatePost;
