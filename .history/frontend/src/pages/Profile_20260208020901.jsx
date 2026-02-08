import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateProfile } from '../context/api';
import PostCard from '../components/PostCard';
import '../styles/Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const isOwnProfile = !userId || userId === currentUser._id;

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (isOwnProfile) {
        setProfile(currentUser);
        setBio(currentUser.bio || '');
      } else {
        const response = await getUserProfile(userId);
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBio = async () => {
    try {
      const response = await updateProfile({ bio });
      updateUser(response.data);
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  if (loading) {
    return <div className="loader">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="error">Profile not found</div>;
  }

  const stats = {
    posts: profile.posts?.length || 0,
    followers: profile.followers?.length || 0,
    following: profile.following?.length || 0,
    totalLikes: profile.posts?.reduce((acc, post) => acc + (post.likes?.length || 0), 0) || 0,
    totalComments: profile.posts?.reduce((acc, post) => acc + (post.comments?.length || 0), 0) || 0,
  };

  return (
    <motion.div 
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
      <div className="profile-avatar">
       {profile?.username?.[0]?.toUpperCase() || '?'}
      </div>

        
        <div className="profile-info">
          <h2>@{profile.username}</h2>
          
          <div className="profile-bio">
            {isEditing ? (
              <div className="bio-edit">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write something about yourself..."
                  rows="3"
                />
                <div className="bio-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleUpdateBio}
                  >
                    Save
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setIsEditing(false);
                      setBio(profile.bio || '');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>{profile.bio || 'No bio yet'}</p>
                {isOwnProfile && (
                  <button 
                    className="btn-edit-bio"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Bio
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <h3>{stats.posts}</h3>
          <p>Posts</p>
        </div>
        <div className="stat-item">
          <h3>{stats.followers}</h3>
          <p>Followers</p>
        </div>
        <div className="stat-item">
          <h3>{stats.following}</h3>
          <p>Following</p>
        </div>
        <div className="stat-item">
          <h3>{stats.totalLikes}</h3>
          <p>Total Likes</p>
        </div>
        <div className="stat-item">
          <h3>{stats.totalComments}</h3>
          <p>Total Comments</p>
        </div>
      </div>

      <div className="profile-posts">
        <h3>Posts</h3>
        {profile.posts && profile.posts.length > 0 ? (
          <div className="posts-grid">
            {profile.posts.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                onUpdate={fetchProfile}
              />
            ))}
          </div>
        ) : (
          <p className="no-posts">No posts yet</p>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
