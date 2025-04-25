import http from '@utils/http';

export const URL_LOGIN = 'auth/login';
export const URL_REGISTER = 'auth/register';

const authApi = {
  login(body) {
    return http.post(URL_LOGIN, body);
  },

  register(body) {
    return http.post(URL_REGISTER, body);
  },
};
export default authApi;
