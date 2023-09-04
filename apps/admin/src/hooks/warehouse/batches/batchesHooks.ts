import AxiosService from "@services/axiosService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URLS } from "@configs/constants/apiUrls";
import { handleAxiosErrorResponse } from "@lib/utils/handleAxiosCommonResponse";

interface FormDataType {
  batch_date: Date | undefined;
  batch_no: string;
  so_number: string;
  target_quantity: number;
  po_category: string;
  customer_id: string;
  product_id: string;
  machine_id: string;
  unit_weight: number;
  unit_type: string;
  package_quantity: number;  
}

export const useBatchFormServiceHook = (isEditMode: boolean, id: string | undefined, onSuccess: (data: any) => void, onError: (errors: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: FormDataType) => {
      let response;
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(API_URLS.WAREHOUSE.BATCH_API + "/" + id, data);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(API_URLS.WAREHOUSE.BATCH_API, data);
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

export const useBatchList = (page: number, pageSize: number, sort: string, filter: { location?: string,  name?: string,  status?: string,  owner_id?: string }, configs = {}) => {
  return useQuery(['batch-list', page, pageSize, sort, filter], async () => {
    const API_URL = AxiosService.getInstance().getUrlWithParams(API_URLS.WAREHOUSE.BATCH_API, { page, pageSize, sort, ...filter });
    const response = await AxiosService.getInstance().axiosInstance.get(API_URL);
    return response.data;
  }, {
    cacheTime: 0,
    retry: 0,
    ...configs
  });
};

export const useBatchDetail = (id: number | string | undefined, configs = {}) => {
  return useQuery(['batch-detail', id], async () => {
    const API_URL = `${API_URLS.WAREHOUSE.BATCH_API}/${id}`;
    const response = await AxiosService.getInstance().axiosInstance.get(API_URL);
    return response.data;
  }, {
    cacheTime: 0,
    retry: 0,
    ...configs
  });
};
