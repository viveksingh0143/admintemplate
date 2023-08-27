import AxiosService from "@services/axiosService";
import { login } from "@services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogin = (onSuccess: (data: {name: string, staff_id: string}) => void, onError: (errors: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    (credentials: { username: string; password: string, rememberMe: boolean }) => login(credentials.username, credentials.password, credentials.rememberMe),
    {
      onSuccess: (data) => {
        const { access_token, refresh_token, name, staff_id } = data;
        // Update the access token in Axios instance
        AxiosService.getInstance().updateAccessToken({ access_token, refresh_token });

        // Invalidate all the queries
        queryClient.invalidateQueries();
        // Redirect to the dashboard or call the provided onSuccess function
        onSuccess({ name, staff_id });
      },
      onError: (error: any) => {
        console.log(error);
        // Handling API error by setting a general form error
        const httpStatusCode = error?.response?.status;
        if (httpStatusCode === 400) {
          onError({
            rootError: { message: error?.response?.data?.message || 'An unexpected error occurred' }
          });
        } else {
          onError({
            rootError: { message: error?.response?.data?.message || error?.message || 'An unexpected error occurred' }
          });
        }
      },
    }
  );
};
