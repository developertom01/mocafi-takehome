import { HttpClientBaseError, HttpClientRequestError, HttpClientResponseError } from "./http-client";


export type ErrorData = {
    message: string;
    data?: Record<string, any> | null;
}

export function handleHttpError(error: Error):ErrorData {
  if (error instanceof HttpClientBaseError) {
    if (error instanceof HttpClientRequestError) {
        return {
            message: 'An error occurred while making the request',
        }
     
    } else if (error instanceof HttpClientResponseError) {
        return {
            message: error.data.message,
            data: error.data || null,
        }
    }
  }
  return {
    message: "An unexpected error occurred",
}
}