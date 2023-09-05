import AxiosService from "@services/axiosService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URLS } from "@configs/constants/apiUrls";
import { handleAxiosErrorResponse } from "@lib/utils/handleAxiosCommonResponse";

interface AddressType {
  address1: string;
  address2: string;
  state: string;
  country: string;
  pincode: string;
}

interface FormDataType {
  code: string;
  name: string;
  contact_person: string;
  status: string;
  billing_address: AddressType;
  shipping_address: AddressType;
}

export const useCustomerFormServiceHook = (isEditMode: boolean, id: string | undefined, onSuccess: (data: any) => void, onError: (errors: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: FormDataType) => {
      let response;
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(API_URLS.CUSTOMER_API + "/" + id, data);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(API_URLS.CUSTOMER_API, data);
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

export const useCustomerList = (page: number, pageSize: number, sort: string, filter: { code?: string,  contact_person?: string,  name?: string,  status?: string }, configs = {}) => {
  return useQuery(['customer-list', page, pageSize, sort, filter], async () => {
    const API_URL = AxiosService.getInstance().getUrlWithParams(API_URLS.CUSTOMER_API, { page, pageSize, sort, ...filter });
    const response = await AxiosService.getInstance().axiosInstance.get(API_URL);
    return response.data;
  }, {
    cacheTime: 0,
    retry: 0,
    ...configs
  });
};

export const useCustomerDetail = (id: number | string | undefined, configs = {}) => {
  return useQuery(['customer-detail', id], async () => {
    const API_URL = `${API_URLS.CUSTOMER_API}/${id}`;
    const response = await AxiosService.getInstance().axiosInstance.get(API_URL);
    return response.data;
  }, {
    cacheTime: 0,
    retry: 0,
    ...configs
  });
};
