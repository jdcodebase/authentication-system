import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let getAccessToken = () => null;
let onAuthFailure = () => {};

export const registerAccessTokenGetter = (getter) => {
  getAccessToken = getter;
};

export const registerAuthFailureHandler = (handler) => {
  onAuthFailure = handler;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

const processQueue = (newToken) => {
  pendingRequests.forEach((callback) => callback(newToken));
  pendingRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401s, and never retry the refresh-token call itself
    // (that would cause infinite recursion if the refresh call also 401s)
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // A refresh is already in flight — queue this request until it resolves
      return new Promise((resolve, reject) => {
        pendingRequests.push((newToken) => {
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/refresh-token");
      const newToken = data.data.accessToken;

      // Let AuthContext know so it updates its state/ref too
      onAuthFailure({
        type: "refreshed",
        accessToken: newToken,
        user: data.data.user,
      });

      processQueue(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(null);
      onAuthFailure({ type: "logout" });
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
