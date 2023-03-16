import { Observable } from 'rxjs';
import { RequestOptions } from '../http.model';

export const HttpInterceptor = 'oryx.HttpInterceptor*';
export const HttpHandler = 'oryx.HttpHandler';

export type HttpHandlerFn = (
  url: string,
  options: RequestOptions
) => Observable<Response>;

export interface HttpHandler {
  handle: HttpHandlerFn;
}

export interface HttpInterceptor {
  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response>;
  shouldInterceptRequest?(url: string, options: RequestOptions): boolean;
}

declare global {
  interface InjectionTokensContractMap {
    [HttpInterceptor]: HttpInterceptor;
    [HttpHandler]: HttpHandler;
  }
}
