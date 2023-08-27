import AxiosService from "@services/axiosService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URLS } from "@configs/constants/apiUrls";

export const useProductCreate = (onSuccess: (data: {code: string, name: string, description: string, unit: string, type: string}) => void, onError: (errors: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: { code: string, name: string, description: string, unit: string, type: string, dependents: {id: string, quantity: number}[] }) => {
      const response = await AxiosService.getInstance().axiosInstance.post(API_URLS.PRODUCT_API, data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        const { code, name, description, unit, type } = data;
        queryClient.invalidateQueries();
        onSuccess({ code, name, description, unit, type });
      },
      onError: (error: any) => {
        let errorMsg = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
        // Handling API error by setting a general form error
        const httpStatusCode = error?.response?.status;
        if (httpStatusCode === 400) {
          errorMsg = error?.response?.data?.message || 'An unexpected error occurred';
        }
        onError({
          rootError: { message: errorMsg }
        });
      },
    }
  );
};

export const useProductList = (page: number, pageSize: number, sort: string, filter: { type?: string,  code?: string, raw_code?: string,  name?: string,  status?: string }) => {
    return useQuery(['product-list', page, pageSize, sort, filter], async () => {
      const API_URL = AxiosService.getInstance().getUrlWithParams(API_URLS.PRODUCT_API, { page, pageSize, sort, ...filter });
      const response = await AxiosService.getInstance().axiosInstance.get(API_URL);
      return response.data;
    }, {
      cacheTime: 0,
      retry: 0
      // Additional configuration options go here
    });
};
