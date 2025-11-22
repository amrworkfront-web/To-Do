import axios from 'axios';

const apiUrl = "http://localhost:1337/api";

const axiosClient = axios.create({
  baseURL: apiUrl,
});

export const setAuthToken = (token: string) => {
  axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default axiosClient;