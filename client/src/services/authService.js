// client/src/services/authService.js
import axios from 'axios';

const API_URL = 'https://voiceyourbill-server.onrender.com/api/users';

// Register user
const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

// Login user
const login = (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};

export default {
  register,
  login,
};
