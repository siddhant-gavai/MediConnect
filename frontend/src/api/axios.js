import axios from 'axios';

// Configure Axios instance for API requests
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true, // Required to send cookies with requests
});

export default api;
