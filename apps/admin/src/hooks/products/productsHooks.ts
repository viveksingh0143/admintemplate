import AxiosService from "@services/axiosService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URLS } from "@configs/constants/apiUrls";
import { handleAxiosErrorResponse } from "@lib/utils/handleAxiosCommonResponse";

interface DependentType {
  id: string;
  quantity: number;
}

interface FormDataType {
  code: string;
  name: string;
  description: string;
  unit: string;
  type: string;
  status: string;
  dependents?: DependentType[];
}

export const useProductFormServiceHook = (isEditMode: boolean, id: string | undefined, onSuccess: (data: any) => void, onError: (errors: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: FormDataType) => {
      let response;
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(API_URLS.PRODUCT_API + "/" + id, data);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(API_URLS.PRODUCT_API, data);
      }
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries();
        onSuccess(data);
      },
      onError: (error: any) => handleAxiosErrorResponse(error, onError)
    }
  );
};

export const useProductList = (page: number, pageSize: number, sort: string, filter: { type?: string, code?: string, raw_code?: string, name?: string, status?: string }, configs = {}) => {
  return useQuery(['product-list', page, pageSize, sort, filter], async () => {
    const API_URL = AxiosService.getInstance().getUrlWithParams(API_URLS.PRODUCT_API, { page, pageSize, sort, ...filter });
    const response = await AxiosService.getInstance().axiosInstance.get(API_URL);
    return response.data;
  }, {
    cacheTime: 0,
    retry: 0,
    ...configs
  });
};

export const useProductDetail = (id: number | string | undefined, configs = {}) => {
  return useQuery(['product-detail', id], async () => {
    const API_URL = `${API_URLS.PRODUCT_API}/${id}`;
    const response = await AxiosService.getInstance().axiosInstance.get(API_URL);
    return response.data;
  }, {
    cacheTime: 0,
    retry: 0,
    ...configs
  });
};
