import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/signup', formData);
export const checkUsername = (username) => API.post('/auth/check-username', { username });

// Post endpoints
export const getAllPosts = () => API.get('/posts');
export const getMyPosts = () => API.get('/posts/my-posts');
export const getLikedPosts = () => API.get('/posts/liked');
export const createPost = (formData) => API.post('/posts', formData);
export const likePost = (postId) => API.post(`/posts/${postId}/like`);
export const commentPost = (postId, comment) => API.post(`/posts/${postId}/comment`, { comment });
export const deletePost = (postId) => API.delete(`/posts/${postId}`);

// User endpoints
export const getUserProfile = (userId) => API.get(`/users/${userId}`);
export const updateProfile = (formData) => API.put('/users/profile', formData);
export const followUser = (userId) => API.post(`/users/${userId}/follow`);

// Notification endpoints
export const getNotifications = () => API.get('/notifications');
export const markAsRead = (notificationId) => API.put(`/notifications/${notificationId}/read`);

export default API;
