import {
  HttpHandlerFn,
  HttpInterceptor,
  RequestOptions,
} from '@spryker-oryx/core';
import { inject, INJECTOR } from '@spryker-oryx/di';
import { map, Observable, switchMap, take } from 'rxjs';
import { CurrencyService } from './currency.service';

export class CurrentCurrencyInterceptor implements HttpInterceptor {
  protected parameterName = 'currency';

  protected includedEndpoints = [
    'concreete-product',
    'catalog-search',
    'catalog-search-suggestions',
  ];

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
      .inject(CurrencyService)
      .get()
      .pipe(
        take(1),
        map((currency) => this.addCurrencyToUrl(url, currency)),
        switchMap((url) => handle(url, options))
      );
  }

  protected addCurrencyToUrl(url: string, currency: string): string {
    const urlObject = new URL(url);
    if (urlObject.searchParams.has(this.parameterName)) return url; // we don't want to override currency, if set
    urlObject.searchParams.set(this.parameterName, currency);
    return urlObject.toString();
  }

  shouldInterceptRequest(url: string): boolean {
    if (!url.startsWith(this.SCOS_BASE_URL)) return false;

    const path = url.substring(this.SCOS_BASE_URL.length);

    for (const endpoint of this.includedEndpoints) {
      if (path.startsWith(`/${endpoint}`)) return true;
    }
    return false;
  }
}
