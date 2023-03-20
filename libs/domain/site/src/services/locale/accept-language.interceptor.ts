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

  protected excludedEndpoints = ['store'];

  constructor(
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected injector = inject(INJECTOR)
  ) {}

  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    return this.injector
      .inject(LocaleService)
      .get()
      .pipe(
        take(1),
        map((locale) => this.addLanguageHeader(locale, options)),
        switchMap((options) => handle(url, options))
      );
  }

  protected addLanguageHeader(
    locale: string,
    options: RequestOptions
  ): RequestOptions {
    return {
      ...options,
      headers: {
        ...options.headers,
        [this.headerName]: locale,
      } as HeadersInit,
    };
  }

  shouldInterceptRequest(url: string): boolean {
    if (!this.SCOS_BASE_URL || !url.startsWith(this.SCOS_BASE_URL))
      return false;

    const path = url.substring(this.SCOS_BASE_URL.length);

    for (const endpoint of this.excludedEndpoints) {
      if (path.startsWith(`/${endpoint}`)) return false;
    }
    return true;
  }
}
