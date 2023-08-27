import { API_URLS } from "@configs/constants/apiUrls";
import AxiosService from "@services/axiosService";

export const createProductService = async (code: string, name: string, description: string, unit: string, type: string) => {
  const response = await AxiosService.getInstance().axiosInstance.post(API_URLS.PRODUCT_API, { code, name, description, unit, type });
  return response.data;
};