import { inject, INJECTOR } from '@spryker-oryx/injector';
import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { RequestOptions } from '../http.model';
import {
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
} from './http-handler.model';

type ChainedInterceptorsFn = (
  url: string,
  options: RequestOptions,
  finalHandlerFn: HttpHandlerFn
) => Observable<Response>;

export class DefaultHttpHandler implements HttpHandler {
  private chain: ChainedInterceptorsFn | null = null;

  constructor(protected injector = inject(INJECTOR)) {}

  handle(
    initialUrl: string,
    initialOptions: RequestOptions
  ): Observable<Response> {
    if (this.chain === null) {
      const interceptors = this.injector.inject(HttpInterceptor, null);

      if (!interceptors) {
        return fromFetch(initialUrl, initialOptions);
      }

      const initialFn = (
        url: string,
        options: RequestOptions,
        handle: HttpHandlerFn
      ): Observable<Response> => {
        return handle(url, options);
      };
      const reducer = (
        chainFn: ChainedInterceptorsFn,
        interceptor: HttpInterceptor
      ) => {
        return (
          url: string,
          options: RequestOptions,
          handle: HttpHandlerFn
        ): Observable<Response> => {
          return interceptor.intercept(url, options, (url, options) =>
            chainFn(url, options, handle)
          );
        };
      };

      this.chain = interceptors.reduceRight(reducer, initialFn);
    }

    return this.chain(initialUrl, initialOptions, (url, options) =>
      fromFetch(url, options)
    );
  }
}
