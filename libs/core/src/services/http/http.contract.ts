import { Observable } from 'rxjs';
import { CoreServices } from '../services';
import { RequestOptions } from './model';

export interface HttpContract {
  request<T = unknown>(url: string, options?: RequestOptions<T>): Observable<T>;
  get<T = unknown>(url: string, options?: RequestOptions<T>): Observable<T>;
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
    [CoreServices.Http]: HttpContract;
  }
}
