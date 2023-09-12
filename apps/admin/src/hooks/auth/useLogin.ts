import AxiosService from "@services/axiosService";
import { loginRequesst } from "@services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "@ctypes/common";

export const useLogin = (onSuccess: (data: {name: string, staff_id: string}) => void, onError: (errors: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    (credentials: { username: string; password: string, remember_me: boolean }) => loginRequesst({ username: credentials.username, password: credentials.password, remember_me: credentials.remember_me}),
    {
      onSuccess: (data) => {
        const { data: { access_token, refresh_token, name, staff_id } } = data;
        AxiosService.getInstance().updateAccessToken({ access_token, refresh_token });

        queryClient.invalidateQueries();
        onSuccess({ name, staff_id });
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
