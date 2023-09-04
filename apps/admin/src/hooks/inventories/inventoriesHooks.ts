import AxiosService from "@services/axiosService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URLS } from "@configs/constants/apiUrls";
import { handleAxiosErrorResponse } from "@lib/utils/handleAxiosCommonResponse";

interface FormDataType {
  product_id: string,
  quantity: number,
  pallet: string,
}

interface FinishedProductFormDataType {
  product_id: string,
  batch: string,
  machine: string,
  quantity: string,
  shift: string,
  supervisor: string,
}

export const useInventoryFormServiceHook = (onSuccess: (data: any) => void, onError: (errors: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: FormDataType) => {
      const response = await AxiosService.getInstance().axiosInstance.post(API_URLS.WAREHOUSE.INVENTORY_RAW_MATERIAL_API, data);
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

export const useInventoryFinishedStockFormServiceHook = (onSuccess: (data: any) => void, onError: (errors: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: FinishedProductFormDataType) => {
      const response = await AxiosService.getInstance().axiosInstance.post(API_URLS.WAREHOUSE.INVENTORY_FINISHED_GOODS_API, data);
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