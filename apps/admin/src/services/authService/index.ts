import { API_URLS } from "@configs/constants/apiUrls";
import AxiosService from "@services/axiosService";

export const loginRequesst = async (data: any) => {
  const response = await AxiosService.getInstance().axiosInstance.post(API_URLS.LOGIN_API, data);
  return response.data;
};