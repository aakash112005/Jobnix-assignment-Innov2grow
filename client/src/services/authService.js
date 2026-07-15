import api, { setAccessToken } from './api';

export const authService = {
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    setAccessToken(data.data.accessToken);
    return data.data.user;
  },
  async login(payload) {
    const { data } = await api.post('/auth/login', payload);
    setAccessToken(data.data.accessToken);
    return data.data.user;
  },
  async logout() {
    await api.post('/auth/logout'); 
    setAccessToken(null);
  },
  async refresh() {
    const { data } = await api.post('/auth/refresh');
    setAccessToken(data.data.accessToken);
    return data.data.user;
  },
  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },
  async resetPassword(token, password) {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
  },
  async getProfile() {
    const { data } = await api.get('/profile');
    return data.data;
  },
};
