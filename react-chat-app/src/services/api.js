// import axios from 'axios';

// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// export const signup = (data) => API.post('/auth/signup', data);
// export const login = (data) => API.post('/auth/login', data);
// export const fetchUsers = () => API.get('/chat/users');

import axios from 'axios';

// ✅ Uses Environment Variable for Backend API
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:7070/api',
});

// ✅ Signup Request
export const signup = async (data) => {
  try {
    return await API.post('/auth/signup', data);
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Login Request
export const login = async (data) => {
  try {
    return await API.post('/auth/login', data);
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch Users for Chat
export const fetchUsers = async () => {
  try {
    return await API.get('/users'); // Fixed path to match backend
  } catch (error) {
    console.error("Fetch Users Error:", error.response?.data || error.message);
    throw error;
  }
};
