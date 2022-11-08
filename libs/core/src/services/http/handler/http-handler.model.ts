import { MultiToken } from '@spryker-oryx/injector';
import { Observable } from 'rxjs';
import { RequestOptions } from '../http.model';

export const HttpInterceptors = `FES.HttpInterceptors${MultiToken}` as const;
export const HttpHandler = 'FES.HttpHandler';

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
}

declare global {
  interface InjectionTokensContractMap {
    [HttpInterceptors]: HttpInterceptor[];
    [HttpHandler]: HttpHandler;
  }
}
