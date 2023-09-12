export type CommonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger' | 'none';


export type ErrorResponse = {
  response?: {
    status?: number,
    data?: {
      errors?: { field: string, message: string, value: any }[],
      message?: string,
    },
  },
  message?: string,
};