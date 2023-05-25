import { ApiResponse } from "./api-response.interface";


export interface ApiResponseDatatable<T> extends ApiResponse {
  data: T[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
