import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests; allow FormData to set Content-Type (multipart)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
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
export const commentPost = (postId, text) => API.post(`/posts/${postId}/comment`, { text });
export const deletePost = (postId) => API.delete(`/posts/${postId}`);

// User endpoints
export const getUserProfile = (userId) => API.get(`/users/${userId}`);
export const updateProfile = (formData) => API.put('/users/update/profile', formData);
export const followUser = (userId) => API.post(`/users/${userId}/follow`);
export const unfollowUser = (userId) => API.delete(`/users/${userId}/follow`);

export default API;
