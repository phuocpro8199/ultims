import eventBus from './eventBus';

export const setAccessTokenToLS = (access_token) => {
  localStorage.setItem('access_token', access_token);
};

export const setRefreshTokenToLS = (refresh_token) => {
  localStorage.setItem('refresh_token', refresh_token);
};

export const setEmailToLS = (email) => {
  localStorage.setItem('email', email);
};

export const getEmailFromLS = () => localStorage.getItem('email') || '';

export const clearLS = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  eventBus.dispatch('logout');
};

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || '';

export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || '';

export const logout = () => {};
