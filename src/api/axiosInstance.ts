import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5012/api',
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
});

export default axiosInstance;