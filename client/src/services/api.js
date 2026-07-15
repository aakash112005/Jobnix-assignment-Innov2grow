import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // send httpOnly refresh cookie
});

// Attach the in-memory access token to every request
api.interceptors.request.use((config) => {
  const token = localStorageGetToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// In-memory token storage (never localStorage - avoids XSS token theft).
// Persisted only via the httpOnly refresh cookie + a silent refresh on load.
let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;
function localStorageGetToken() {
  return accessToken;
}

let isRefreshing = false;
let refreshQueue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.data.accessToken);
        refreshQueue.forEach((p) => p.resolve(data.data.accessToken));
        refreshQueue = [];
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        refreshQueue.forEach((p) => p.reject(refreshErr));
        refreshQueue = [];
        setAccessToken(null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
