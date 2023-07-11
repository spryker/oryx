import {
  HttpHandlerFn,
  HttpInterceptor,
  RequestOptions,
} from '@spryker-oryx/core';
import { inject, INJECTOR } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { map, Observable, switchMap, take } from 'rxjs';

export class AcceptLanguageInterceptor implements HttpInterceptor {
  protected headerName = 'Accept-Language';

  protected excludedEndpoints = ['/store', '/token'];

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
    const headers = new Headers(options.headers);

    headers.set(this.headerName, locale);

    return { ...options, headers };
  }

  shouldInterceptRequest(urlStr: string): boolean {
    if (!this.SCOS_BASE_URL || !urlStr.startsWith(this.SCOS_BASE_URL)) {
      return false;
    }

    const path = new URL(urlStr).pathname;

    return !this.excludedEndpoints.some((endpoint) =>
      path.startsWith(endpoint)
    );
  }
}
