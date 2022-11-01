import { Observable } from 'rxjs';
import { RequestOptions } from './http.model';

export const HttpService = 'FES.HttpService';

export interface HttpService {
  request<T = unknown>(url: string, options?: RequestOptions<T>): Observable<T>;
  get<T = unknown>(url: string, options?: RequestOptions<T>): Observable<T>;
  delete<T = unknown>(url: string, options?: RequestOptions<T>): Observable<T>;
  post<T = unknown>(
    url: string,
    body: unknown,
    options?: RequestOptions<T>
  ): Observable<T>;
  patch<T = unknown>(
    url: string,
    body: unknown,
    options?: RequestOptions<T>
  ): Observable<T>;
}

declare global {
  interface InjectionTokensContractMap {
    [HttpService]: HttpService;
  }
}
