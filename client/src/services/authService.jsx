import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // adjust if server runs on different port

// Register user
export const registerUser = async (formData) => {
  const res = await axios.post(`${API_URL}/register`, formData);
  return res.data;
};

// Login user
export const loginUser = async (formData) => {
  const res = await axios.post(`${API_URL}/login`, formData);
  return res.data;
};

// Get current user profile
export const getProfile = async (token) => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
