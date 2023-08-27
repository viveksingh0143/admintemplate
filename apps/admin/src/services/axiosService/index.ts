import { API_URLS } from '@configs/constants/apiUrls';
import { CommonConstant } from '@configs/constants/common';
import { EncryptionConstant } from '@configs/constants/encryption';
import { decryptData, encryptData } from '@lib/cryptography';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { InternalAxiosRequestConfig } from 'axios/index';

class AxiosService {
  private static instance: AxiosService;
  public axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REST_API_BASE_URL,
      timeout: parseInt(process.env.REST_API_TIMEOUT || '10000'),
    });

    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers = config.headers || {};
        const myTokens = localStorage.getItem(CommonConstant.LOCAL_STORAGE.MY_TOKENS_KEY);
        if (myTokens) {
          const { access_token: accessToken } = decryptData<{ access_token: string, refresh_token: string }>(myTokens, EncryptionConstant.secret);
          if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401 && error.config.url !== API_URLS.REFRESH_API) {
          const myTokens = localStorage.getItem(CommonConstant.LOCAL_STORAGE.MY_TOKENS_KEY);
          if (myTokens) {
            const { refresh_token: refreshToken } = decryptData<{ access_token: string, refresh_token: string }>(myTokens, EncryptionConstant.secret);
            if (refreshToken) {
              try {
                const response: AxiosResponse = await this.axiosInstance.post(API_URLS.REFRESH_API, { refreshToken });
                const myNewTokens: { access_token: string, refresh_token: string } = response.data;

                localStorage.setItem(CommonConstant.LOCAL_STORAGE.MY_TOKENS_KEY, encryptData(myNewTokens, EncryptionConstant.secret));

                // Update the original request with the new access token
                error.config.headers['Authorization'] = `Bearer ${myNewTokens.access_token}`;
                // Retry the original request
                return this.axiosInstance.request(error.config);
              } catch (err) {
                // TODO: Handle failed refresh token logic here, such as logging out the user
              }
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService();
    }
    return AxiosService.instance;
  }

  public updateAccessToken(tokens: { access_token: string, refresh_token: string }) {
    localStorage.setItem(CommonConstant.LOCAL_STORAGE.MY_TOKENS_KEY, encryptData(tokens, EncryptionConstant.secret));
    if (AxiosService.instance) {
      AxiosService.instance.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.access_token}`;
    }
  }

  public getUrlWithParams(url: string, params: any) {
    let queryString = this.getQueryString(params);
    if (queryString === "") {
      return url;
    } else {
      return url + "?" + queryString;
    }
  }

  public getQueryString(params: any): string {
    if (typeof params == "string") {
      return params;
    } else if (Array.isArray(params)) {
      return params.filter(param => param)
        .map(param => this.getQueryString(param))
        .join('&');
    } else if (typeof params == "object") {
      return Object.keys(params)
        .filter(key => params[key])
        .map(key => {
          return `${key}=${encodeURIComponent(params[key])}`;
        })
        .join('&');
    }
    return "";
  }
}

export default AxiosService;
