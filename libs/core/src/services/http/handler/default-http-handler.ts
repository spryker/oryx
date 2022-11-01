import { inject } from '@spryker-oryx/injector';
import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { RequestOptions } from '../http.model';
import {
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpInterceptors,
} from './http-handler.model';

type ChainedInterceptorsFn = (
  url: string,
  options: RequestOptions,
  finalHandlerFn: HttpHandlerFn
) => Observable<Response>;

export class DefaultHttpHandler implements HttpHandler {
  private chain: ChainedInterceptorsFn | null = null;

  constructor(protected interceptors = inject(HttpInterceptors, null)) {}

  handle(
    initialUrl: string,
    initialOptions: RequestOptions
  ): Observable<Response> {
    if (!this.interceptors) {
      return fromFetch(initialUrl, initialOptions);
    }

    if (this.chain === null) {
      const initialFn = (
        url: string,
        options: RequestOptions,
        handle: HttpHandlerFn
      ): Observable<Response> => {
        return handle(url, options);
      };
      const reducer = (
        chainFn: ChainedInterceptorsFn,
        interceptor: HttpInterceptor | (() => HttpInterceptor)
      ) => {
        return (
          url: string,
          options: RequestOptions,
          handle: HttpHandlerFn
        ): Observable<Response> => {
          return (
            typeof interceptor === 'function' ? interceptor() : interceptor
          ).intercept(url, options, (url, options) =>
            chainFn(url, options, handle)
          );
        };
      };

      this.chain = this.interceptors.reduceRight(reducer, initialFn);
    }

    return this.chain(initialUrl, initialOptions, (url, options) =>
      fromFetch(url, options)
    );
  }
}
