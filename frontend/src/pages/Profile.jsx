import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateProfile, followUser, unfollowUser, getMyPosts, getAllPosts } from '../context/api';
import PostCard from '../components/PostCard';
import '../styles/Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [listModal, setListModal] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [followersDetails, setFollowersDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);

  const currentUserId = currentUser?._id ?? currentUser?.id;
  const isOwnProfile = !userId || (currentUserId && String(userId) === String(currentUserId));

  const fetchProfile = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      if (isOwnProfile) {
        setProfile({ ...currentUser, followers: currentUser?.followers || [], following: currentUser?.following || [] });
        const res = await getMyPosts();
        setPosts(res.data || []);
      } else {
        const response = await getUserProfile(userId);
        setProfile(response.data);
        const allRes = await getAllPosts();
        const userPosts = (allRes.data || []).filter((p) => String(p.user?.userId || p.user?.userId) === String(userId));
        setPosts(userPosts);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [isOwnProfile, currentUser, userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!profile) return;
    setBio(profile.bio || '');
  }, [profile]);

  const handleUpdateBio = async () => {
    try {
      const response = await updateProfile({ bio });
      updateUser(response.data);
      setProfile((prev) => (prev ? { ...prev, bio: response.data.bio } : null));
      setIsEditing(false);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleFollow = async () => {
    if (!userId || followLoading) return;
    setFollowLoading(true);
    try {
      const response = await followUser(userId);
      updateUser(response.data);
      if (!isOwnProfile) await fetchProfile(true);
    } catch (e) {
      console.error('Follow error:', e);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!userId || followLoading) return;
    setFollowLoading(true);
    try {
      const response = await unfollowUser(userId);
      updateUser(response.data);
      if (!isOwnProfile) await fetchProfile(true);
    } catch (e) {
      console.error('Unfollow error:', e);
    } finally {
      setFollowLoading(false);
    }
  };

  const isFollowing = () => {
    if (!currentUser?.following || !profile?._id) return false;
    const pid = String(profile._id);
    return (currentUser.following || []).some((f) => String(f._id || f) === pid);
  };

  const displayName = profile?.name || profile?.username || 'User';
  const followersList = useMemo(() => profile?.followers || [], [profile?.followers]);
  const followingList = useMemo(() => profile?.following || [], [profile?.following]);

  // Fetch user details for followers and following
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch details for followers
        if (followersList.length > 0) {
          const followerPromises = followersList.map(async (follower) => {
            // If follower is an object with user details, use it directly
            if (typeof follower === 'object' && follower.username) {
              return follower;
            }
            // If follower is just an ID, fetch user details
            const response = await getUserProfile(follower);
            return response.data;
          });
          const followersData = await Promise.all(followerPromises);
          setFollowersDetails(followersData);
        }

        // Fetch details for following
        if (followingList.length > 0) {
          const followingPromises = followingList.map(async (following) => {
            // If following is an object with user details, use it directly
            if (typeof following === 'object' && following.username) {
              return following;
            }
            // If following is just an ID, fetch user details
            const response = await getUserProfile(following);
            return response.data;
          });
          const followingData = await Promise.all(followingPromises);
          setFollowingDetails(followingData);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [followersList, followingList]);

  // Calculate total likes and comments across all posts
  const totalLikes = posts.reduce((sum, post) => {
    return sum + (Array.isArray(post.likes) ? post.likes.length : 0);
  }, 0);

  const totalComments = posts.reduce((sum, post) => {
    return sum + (Array.isArray(post.comments) ? post.comments.length : 0);
  }, 0);

  if (loading && !profile) {
    return <div className="loader">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="error">Profile not found</div>;
  }

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="profile-cover" style={{ backgroundImage: profile.coverImage ? `url(${profile.coverImage})` : undefined }} />

      <div className="profile-header">
        <div className="profile-avatar-wrap">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt="" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar">
              {(displayName[0] || '?').toUpperCase()}
            </div>
          )}
        </div>

        <div className="profile-info">
          <h2>@{profile.username || displayName}</h2>
          {!isOwnProfile && (
            <button
              type="button"
              className={`btn-follow ${isFollowing() ? 'following' : ''}`}
              onClick={isFollowing() ? handleUnfollow : handleFollow}
              disabled={followLoading}
            >
              {followLoading ? '...' : isFollowing() ? 'Unfollow' : 'Follow'}
            </button>
          )}
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
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleUpdateBio}>Save</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setIsEditing(false); setBio(profile.bio || ''); }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="profile-bio-text" style={{ fontSize: '1.1em', lineHeight: '1.4' }}>
                  {profile.bio || 'No bio yet'}
                </p>
                {isOwnProfile && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                    
                    <button type="button" className="btn-edit-bio" onClick={() => setIsEditing(true)}>Edit Bio</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <h3>{posts.length}</h3>
          <p>Posts</p>
        </div>
        <button type="button" className="stat-item stat-clickable" onClick={() => setListModal('followers')}>
          <h3>{followersList.length}</h3>
          <p>Followers</p>
        </button>
        <button type="button" className="stat-item stat-clickable" onClick={() => setListModal('following')}>
          <h3>{followingList.length}</h3>
          <p>Following</p>
        </button>
      </div>

      {isOwnProfile && (
        <div className="profile-engagement-stats">
          <h3>Engagement Stats</h3>
          <div className="engagement-grid">
            <div className="engagement-item">
              <div className="engagement-icon">❤️</div>
              <div className="engagement-info">
                <h4>{totalLikes}</h4>
                <p>Total Likes</p>
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-icon">💬</div>
              <div className="engagement-info">
                <h4>{totalComments}</h4>
                <p>Total Comments</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="profile-posts">
        <h3>Posts</h3>
        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={fetchProfile} />
            ))}
          </div>
        ) : (
          <p className="no-posts">No posts yet</p>
        )}
      </div>

      <AnimatePresence>
        {listModal && (
          <motion.div
            className="profile-list-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setListModal(null)}
          >
            <motion.div 
              className="list-modal-content"
              initial={{ scale: 0.9, opacity: 0, x: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{listModal === 'followers' ? 'Followers' : 'Following'}</h3>
                <button type="button" className="btn-close-modal" onClick={() => setListModal(null)}>
                  ✕
                </button>
              </div>
              <div className="user-list">
                {(listModal === 'followers' ? followersDetails : followingDetails).map((u) => (
                  <div key={u._id || u} className="user-item">
                    <div className="user-avatar">
                      {(u.username || u.name || 'user').charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <div className="user-name">
                        {u.username ? `@${u.username}` : u.name ? `@${u.name}` : '@user'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {((listModal === 'followers' ? followersDetails : followingDetails).length === 0) && (
                <div className="list-empty">
                  <div className="empty-icon">👥</div>
                  <p>No {listModal === 'followers' ? 'followers' : 'following'} yet</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
