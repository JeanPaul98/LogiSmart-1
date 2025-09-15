export type ApiResponse<T> = {
    success: boolean;
    status: number;
    message?: string;
    data?: T | null;
  };


  export function formatResponse<T>(success: boolean, data?: T, message?: string, status = 200) {
    return {
      success,
      status,
      message,
      data,
    };
  }