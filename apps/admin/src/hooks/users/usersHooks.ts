import AxiosService from "@services/axiosService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URLS } from "@configs/constants/apiUrls";
import { handleAxiosErrorResponse } from "@lib/utils/handleAxiosCommonResponse";

interface FormDataType {
  staff_id: string;
  name: string;
  email: string;
  password: string;
  roles: string[];
}

export const useUserFormServiceHook = (isEditMode: boolean, id: string | undefined, onSuccess: (data: any) => void, onError: (errors: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: FormDataType) => {
      let response;
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(API_URLS.USER_API + "/" + id, data);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(API_URLS.USER_API, data);
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

export const useUserList = (page: number, pageSize: number, sort: string, filter: { staff_id?: string, email?: string, name?: string, status?: string }, configs = {}) => {
  return useQuery(['user-list', page, pageSize, sort, filter], async () => {
    const API_URL = AxiosService.getInstance().getUrlWithParams(API_URLS.USER_API, { page, pageSize, sort, ...filter });
    // const response = await AxiosService.getInstance().axiosInstance.get(API_URL);
    // return response.data;
    return {
        data: [
          {
            id: 1,
            staff_id: "10001",
            name: "Administrator",
            email: "admin@demo.com",
            status: "active",
            created_at: "2023-08-29T03:58:40Z",
            updated_at: "2023-08-29T09:38:00Z",
            last_updated_by: "",
            role: "ADMIN"
          }
        ],
        total_items: 1,
        page: 1,
        page_size: 10,
        total_pages: 1
    };
  }, {
    cacheTime: 0,
    retry: 0,
    ...configs
  });
};

export const useUserDetail = (id: number | string | undefined, configs = {}) => {
  return useQuery(['user-detail', id], async () => {
    const API_URL = `${API_URLS.USER_API}/${id}`;
    const response = await AxiosService.getInstance().axiosInstance.get(API_URL);
    return response.data;
  }, {
    cacheTime: 0,
    retry: 0,
    ...configs
  });
};
