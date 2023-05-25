import { ApiResponse } from "./api-response.interface";


export interface ApiResponseValue<T> extends ApiResponse {
  value: T;
}
