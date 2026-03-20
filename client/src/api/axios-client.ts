import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5058/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Variables for token refresh queueing
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh with Queue logic
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is already in progress, add this request to the queue
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosClient(originalRequest);
            }
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      const email = useAuthStore.getState().user?.email;

      if (refreshToken && email) {
        try {
          // Attempt to refresh token using the body (to match the .NET AuthController)
          const response = await axios.post(`${axiosClient.defaults.baseURL}/auth/refresh-token`, {
            email,
            refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

          // Update Zustand store
          const currentUser = useAuthStore.getState().user!;
          useAuthStore.getState().setAuth(currentUser, newAccessToken, newRefreshToken);

          // Process the rest of the queue with the new token
          processQueue(null, newAccessToken);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear all pending requests and logout
          processQueue(refreshError, null);
          useAuthStore.getState().clearAuth();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
