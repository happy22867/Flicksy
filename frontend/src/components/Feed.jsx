import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getAllPosts, getMyPosts, getLikedPosts } from '../context/api';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import '../styles/Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      switch (filter) {
        case 'all':
          response = await getAllPosts();
          break;
        case 'my':
          response = await getMyPosts();
          break;
        case 'liked':
          response = await getLikedPosts();
          break;
        default:
          response = await getAllPosts();
      }
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPosts();
  }, [filter, fetchPosts]);

  const handlePostUpdate = () => {
    fetchPosts();
  };

  return (
    <div className="feed-wrapper">
      <div className="feed-main">
        <motion.div
          className="feed-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Post creation at top - compact inline */}
          <section className="feed-composer-section" aria-label="Create post">
            <CreatePost onPostCreated={handlePostUpdate} inline />
          </section>

          {/* Filter pills */}
          <div className="feed-header">
            <div className="feed-filters">
              <button
                type="button"
                className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`filter-pill ${filter === 'my' ? 'active' : ''}`}
                onClick={() => setFilter('my')}
              >
                My posts
              </button>
              <button
                type="button"
                className={`filter-pill ${filter === 'liked' ? 'active' : ''}`}
                onClick={() => setFilter('liked')}
              >
                Liked
              </button>
            </div>
          </div>

          <div className="feed-content">
            {loading ? (
              <div className="feed-loader">
                <span className="feed-loader-dot" />
                <span className="feed-loader-dot" />
                <span className="feed-loader-dot" />
              </div>
            ) : posts.length === 0 ? (
              <motion.div
                className="feed-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>No posts yet. Be the first to share!</p>
              </motion.div>
            ) : (
              <div className="posts-grid">
                {posts.map((post, i) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onUpdate={handlePostUpdate}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Feed;
