import { Observable } from 'rxjs';
import { RequestOptions } from '../http.model';

export const HttpInterceptor = 'oryx.HttpInterceptor*';
export const HttpHandler = 'oryx.HttpHandler';

export type HttpHandlerFn = (req: Request) => Observable<Response>;

export interface HttpHandler {
  handle: HttpHandlerFn;
}

export interface HttpInterceptor {
  intercept(req: Request, handle: HttpHandlerFn): Observable<Response>;
  shouldInterceptRequest?(req: Request): boolean;
}

declare global {
  interface InjectionTokensContractMap {
    [HttpInterceptor]: HttpInterceptor;
    [HttpHandler]: HttpHandler;
  }
}
