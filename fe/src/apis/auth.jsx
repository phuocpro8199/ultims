import http from '@utils/http';

export const URL_LOGIN = 'auth/login';

const authApi = {
  login(body) {
    return http.post(URL_LOGIN, body);
  },
};
export default authApi;
