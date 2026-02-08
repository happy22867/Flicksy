import React, { useState, useEffect } from 'react';
import { getAllPosts, getMyPosts, getLikedPosts } from '../context/api';
import PostCard from './PostCard';
import '../styles/Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all'); // all, my, liked
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
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
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = () => {
    fetchPosts();
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>Feed</h2>
        <div className="feed-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Posts
          </button>
          <button
            className={`filter-btn ${filter === 'my' ? 'active' : ''}`}
            onClick={() => setFilter('my')}
          >
            My Posts
          </button>
          <button
            className={`filter-btn ${filter === 'liked' ? 'active' : ''}`}
            onClick={() => setFilter('liked')}
          >
            Liked Posts
          </button>
        </div>
      </div>

      <div className="feed-content">
        {loading ? (
          <div className="loader">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts to show</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                onUpdate={handlePostUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
