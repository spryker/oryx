import { inject, INJECTOR } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
} from './http-handler.model';

type ChainedInterceptorsFn = (
  req: Request,
  finalHandlerFn: HttpHandlerFn
) => Observable<Response>;

export class DefaultHttpHandler implements HttpHandler {
  private chain: ChainedInterceptorsFn | null = null;

  constructor(protected injector = inject(INJECTOR)) {}

  handle(initialRequest: Request): Observable<Response> {
    if (this.chain === null) {
      const interceptors = this.injector.inject(HttpInterceptor, null);

      if (!interceptors) {
        return fromFetch(initialRequest);
      }

      const initialFn = (
        req: Request,
        handle: HttpHandlerFn
      ): Observable<Response> => {
        return handle(req);
      };
      const reducer = (
        chainFn: ChainedInterceptorsFn,
        interceptor: HttpInterceptor
      ) => {
        return (req: Request, handle: HttpHandlerFn): Observable<Response> => {
          if (
            interceptor.shouldInterceptRequest &&
            !interceptor.shouldInterceptRequest(req)
          ) {
            return chainFn(req, handle);
          }

          return interceptor.intercept(req, (req) => chainFn(req, handle));
        };
      };

      this.chain = interceptors.reduceRight(reducer, initialFn);
    }

    return this.chain(initialRequest, (req) => fromFetch(req));
  }
}
