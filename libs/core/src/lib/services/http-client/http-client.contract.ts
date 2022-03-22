import { Observable } from 'rxjs';
import { CoreServices, HttpClientOptions } from '../../services';

export interface HTTPClientContract {
  request<T = unknown>(
    url: string,
    options?: HttpClientOptions<T>
  ): Observable<T>;
  get<T = unknown>(url: string, options?: HttpClientOptions<T>): Observable<T>;
  post<T = unknown>(
    url: string,
    body: BodyInit,
    options?: HttpClientOptions<T>
  ): Observable<T>;
}

declare global {
  interface InjectionTokensContractMap {
    [CoreServices.Http]: HTTPClientContract;
  }
}
