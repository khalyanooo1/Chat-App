
// import axios from 'axios';

// // ✅ Uses Environment Variable for Backend API
// const API = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:7070/api',
// });

// // ✅ Signup Request
// export const signup = async (data) => {
//   try {
//     return await API.post('/auth/signup', data);
//   } catch (error) {
//     console.error("Signup Error:", error.response?.data || error.message);
//     throw error;
//   }
// };

// // ✅ Login Request
// export const login = async (data) => {
//   try {
//     return await API.post('/auth/login', data);
//   } catch (error) {
//     console.error("Login Error:", error.response?.data || error.message);
//     throw error;
//   }
// };

// // ✅ Fetch Users for Chat
// export const fetchUsers = async () => {
//   try {
//     return await API.get('/users'); // Fixed path to match backend
//   } catch (error) {
//     console.error("Fetch Users Error:", error.response?.data || error.message);
//     throw error;
//   }
// };

import axios from 'axios';

// ✅ Ensure `baseURL` correctly includes `/api`
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:7070";
const API = axios.create({
  baseURL: `${BACKEND_URL}/api`, // Ensures correct API path
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Signup Request
export const signup = async (data) => {
  try {
    const response = await API.post('/auth/signup', data);
    return response.data; // Ensures only data is returned
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Login Request
export const login = async (data) => {
  try {
    const response = await API.post('/auth/login', data);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch Users for Chat
export const fetchUsers = async () => {
  try {
    const response = await API.get('/users'); // Fetch users list
    return response.data;
  } catch (error) {
    console.error("Fetch Users Error:", error.response?.data || error.message);
    throw error;
  }
};
