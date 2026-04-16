import axios from 'axios';

const api = axios.create({
  baseURL: 'https://purplemint.onrender.com',
  withCredentials: true, // Send cookies with requests
});

export default api;
