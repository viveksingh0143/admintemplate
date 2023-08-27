import AxiosService from "@services/axiosService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URLS } from "@configs/constants/apiUrls";

export const useContainerCreate = (onSuccess: (data: {code: string, name: string, address: string, type: string}) => void, onError: (errors: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: { code: string, name: string, address: string, type: string }) => {
      const response = await AxiosService.getInstance().axiosInstance.post(API_URLS.WAREHOUSE.CONTAINER_API, data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        const { code, name, address, type } = data;
        queryClient.invalidateQueries();
        onSuccess({ code, name, address, type });
      },
      onError: (error: any) => {
        let errorMsg = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
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

export const useContainerList = (page: number, pageSize: number, sort: string, filter: { type?: string,  code?: string,  name?: string,  status?: string }) => {
    return useQuery(['container-list', page, pageSize, sort, filter], async () => {
      const API_URL = AxiosService.getInstance().getUrlWithParams(API_URLS.WAREHOUSE.CONTAINER_API, { page, pageSize, sort, ...filter });
      const response = await AxiosService.getInstance().axiosInstance.get(API_URL);
      return response.data;
    }, {
      // Additional configuration options go here
    });
};
