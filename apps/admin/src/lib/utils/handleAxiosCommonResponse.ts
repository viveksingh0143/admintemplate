export const handleAxiosErrorResponse = (error: any, onError: (errors: any) => void) => {
  let errorMsg = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
  const httpStatusCode = error?.response?.status;
  if (httpStatusCode === 400) {
    errorMsg = error?.response?.data?.message || 'An unexpected error occurred';
  }
  onError({
    rootError: { message: errorMsg }
  });
}

