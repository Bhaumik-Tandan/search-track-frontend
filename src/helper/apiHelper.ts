import axios, { AxiosRequestConfig } from 'axios';
import CONSTANTS from "../constants";

const API_URL = process.env.REACT_APP_API;
const REQUEST_TIMEOUT = "10000";

const config: AxiosRequestConfig = {
    baseURL: [API_URL, '/api/v1'].join(''),
    timeout: parseInt(REQUEST_TIMEOUT, 10),
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
};

const request = axios.create(config);

// Add an interceptor to include the token in the request headers
request.interceptors.request.use(
    (reqConfig) => {
        const token = localStorage.getItem(CONSTANTS.TOKEN);
        if (token) {
            reqConfig.headers.Authorization = `Bearer ${token}`;
        }

        return reqConfig;
    },
    (error) => Promise.reject(error),
);

export default request;
