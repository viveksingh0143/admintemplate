import { API_URLS } from "@configs/constants/apiUrls";
import AxiosService from "@services/axiosService";

export const login = async (username: string, password: string, rememberMe: boolean) => {
  const response = await AxiosService.getInstance().axiosInstance.post(API_URLS.LOGIN_API, { username, password, rememberMe });
  return response.data;
};