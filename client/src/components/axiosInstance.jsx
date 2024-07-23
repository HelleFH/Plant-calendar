import axios from 'axios';

// Determine the baseURL based on the environment
const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001/api/v1'
  : 'https://plant-calendar-opoo.onrender.com/api/v1';

// Create an instance of Axios with the determined baseURL
const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
