import axios from 'axios';
import config from '@constants/config';
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS } from './auth';
import httpStatus from '@constants/httpStatusCode';
import { notification } from 'antd';
import { authMessage } from '@constants/common';
import { URL_LOGIN, URL_REGISTER } from '@apis/auth';

class Http {
  accessToken;
  instance;
  constructor() {
    this.accessToken = getAccessTokenFromLS();

    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;

        if (url === URL_LOGIN || url === URL_REGISTER) {
          this.accessToken = response.data.token;

          setAccessTokenToLS(this.accessToken);
        }

        return response;
      },
      (error) => {
        console.error(error);
        if (error.response?.data.statusCode === httpStatus.Unauthorized) {
          if (error.response.data.message === 'Unauthorized') {
            notification.error({ message: authMessage.REFRESH_TOKEN_EXPIRED });
            clearLS();
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;
export default http;
