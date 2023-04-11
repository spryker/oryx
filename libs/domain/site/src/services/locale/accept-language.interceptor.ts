import {
  createQuery,
  HttpHandlerFn,
  HttpInterceptor,
  RequestOptions,
} from '@spryker-oryx/core';
import { inject, INJECTOR } from '@spryker-oryx/di';
import { LocaleChanged, LocaleService } from '@spryker-oryx/i18n';
import { map, Observable, switchMap } from 'rxjs';

export class AcceptLanguageInterceptor implements HttpInterceptor {
  protected headerName = 'Accept-Language';

  protected excludedEndpoints = ['/store', '/token'];

  protected localeQuery = createQuery({
    loader: (q: unknown) => this.injector.inject(LocaleService).get(),
    refreshOn: [LocaleChanged],
  });

  constructor(
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected injector = inject(INJECTOR)
  ) {}

  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    return this.localeQuery.get({}).pipe(
      map((locale) => this.addLanguageHeader(locale ?? 'en', options)),
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
