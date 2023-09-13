import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "@ctypes/common";
import AxiosService from "@services/axiosService";

export const useAxiosMutation = (
  requestFunction: (data: any) => Promise<any>, 
  onSuccess: (data: any) => void, 
  onError: (errors: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<any, ErrorResponse, any>(
    (data: any) => requestFunction(data),
    {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries();
        onSuccess(data);
      },
      onError: (error: ErrorResponse) => {
        const httpStatusCode = error?.response?.status;
        const errorsObj: Record<string, any> = {};
        if (error?.response?.data?.errors) {
          error.response.data.errors.forEach((err) => {
            const { message, value } = err;
            errorsObj[err.field] = { message, value };
          });
        }
        errorsObj["rootError"] = { message: getRootErrorMessage(error, httpStatusCode) };
        onError(errorsObj)
      }
    }
  );
};

const getRootErrorMessage = (error: ErrorResponse, httpStatusCode: number | undefined): string => {
  if (httpStatusCode === 400) {
    return error?.response?.data?.message || 'An unexpected error occurred';
  }
  return error?.response?.data?.message || error?.message || 'An unexpected error occurred';
};


export const useAxiosQueryWithParams = ( REST_API_URL: string, page: number, pageSize: number, sort: string, filter: any, shouldFetch: boolean = true, configs: any = {} ) => {
  return useQuery([REST_API_URL, page, pageSize, sort, filter], async () => {
    const API_URL = AxiosService.getInstance().getUrlWithParams(REST_API_URL, { page, pageSize, sort, ...filter });
    const response = await AxiosService.getInstance().axiosInstance.get(API_URL);
    return response.data;
  }, {
    cacheTime: 0,
    enabled: shouldFetch,
    retry: 0,
    ...configs
  });
};

export const useAxiosQuery = ( REST_API_URL: string, configs: any = {} ) => {
  return useQuery([REST_API_URL], async () => {
    const response = await AxiosService.getInstance().axiosInstance.get(REST_API_URL);
    return response.data;
  }, {
    cacheTime: 0,
    retry: 0,
    ...configs
  });
};