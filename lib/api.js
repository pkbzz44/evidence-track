import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export default AxiosInstance;
