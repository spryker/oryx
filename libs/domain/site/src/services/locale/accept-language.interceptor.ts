import {
  HttpHandlerFn,
  HttpInterceptor,
  RequestOptions,
} from '@spryker-oryx/core';
import { inject, INJECTOR } from '@spryker-oryx/di';
import { map, Observable, switchMap, take } from 'rxjs';
import { LocaleService } from './locale.service';

export class AcceptLanguageInterceptor implements HttpInterceptor {
  protected headerName = 'Accept-Language';

  constructor(
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected injector = inject(INJECTOR)
  ) {}

  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    if (!this.shouldInterceptRequest(url)) {
      return handle(url, options);
    }

    return this.injector
      .inject(LocaleService)
      .get()
      .pipe(
        take(1),
        map((locale) => {
          return {
            ...options,
            headers: {
              ...options.headers,
              [this.headerName]: locale,
            } as HeadersInit,
          };
        }),
        switchMap((options) => handle(url, options))
      );
  }

  protected shouldInterceptRequest(url: string): boolean {
    return (
      url.startsWith(this.SCOS_BASE_URL) &&
      !url.startsWith(`${this.SCOS_BASE_URL}/stores`)
    );
  }
}
