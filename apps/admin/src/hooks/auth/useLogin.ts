import AxiosService from "@services/axiosService";
import { login } from "@services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogin = (onSuccess: () => void, onError: (errors: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    (credentials: { username: string; password: string, rememberMe: boolean }) => login(credentials.username, credentials.password, credentials.rememberMe),
    {
      onSuccess: (data) => {
        const { access_token, refresh_token } = data;
        // Update the access token in Axios instance
        AxiosService.getInstance().updateAccessToken({ access_token, refresh_token });

        // Invalidate all the queries
        queryClient.invalidateQueries();
        // Redirect to the dashboard or call the provided onSuccess function
        onSuccess();
      },
      onError: (error: any) => {
        // Handling API error by setting a general form error
        const httpStatusCode = error?.response?.status;
        console.log("--------------------");
        console.log(error.message);
        console.log("--------------------");
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
