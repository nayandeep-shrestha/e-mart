import axios from 'axios';
import { useContext } from 'react';
// import { message } from 'antd';
// eslint-disable-next-line import/no-cycle
import { AuthContext } from '../context/auth/AuthProvider';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  timeoutErrorMessage: 'Server timed out ...',
  headers: {
    accept: 'application/json',
  },
  withCredentials: true,
});

const useAxiosInterceptors = () => {
  const authContext = useContext(AuthContext);

  axiosInstance.interceptors.request.use(
    async (config) => {
      let token = authContext?.accessToken;

      if (!token) {
        token = localStorage.getItem('accessToken');
      }

      const newConfig = {
        ...config,
      };
      newConfig.headers.Authorization = `Bearer ${token}`;
      return newConfig;
    },
    (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        originalRequest.url === '/auth/refetch' &&
        error.response.status === 403
      ) {
        localStorage.removeItem('accessToken');
        window.location.href = '/';
        return Promise.reject(error);
      }

      if (error.response.status === 403 && !originalRequest.retryFlag) {
        originalRequest.retryFlag = true;

        try {
          const response = await axiosInstance.get('/auth/refetch');

          if (response.status === 403) {
            console.error('Token refresh failed with 403 status');
            localStorage.removeItem('accessToken');
            window.location.href = '/';
            return await Promise.reject(error);
          }

          const newAccessToken = response.data.result.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          authContext?.setAccessToken(newAccessToken);

          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return await axiosInstance(originalRequest);
        } catch (err) {
          console.error(err);
          // localStorage.removeItem('accessToken');
          // window.location.href = '/';
          return Promise.reject(err);
        }
      }

      if (error.response?.data?.error) {
        console.error(error.response.data.error);
      }

      return Promise.reject(error);
    },
  );
};

export { axiosInstance, useAxiosInterceptors };
