import { HttpHandlerFn, HttpInterceptor } from '@spryker-oryx/core';
import { inject, INJECTOR } from '@spryker-oryx/di';
import { map, Observable, switchMap, take } from 'rxjs';
import { CurrencyService } from './currency.service';

export class CurrentCurrencyInterceptor implements HttpInterceptor {
  protected parameterName = 'currency';

  protected includedEndpoints = [
    'concrete-products',
    'catalog-search',
    'catalog-search-suggestions',
  ];

  constructor(
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected injector = inject(INJECTOR)
  ) {}

  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    return this.injector
      .inject(CurrencyService)
      .get()
      .pipe(
        take(1),
        map((currency) => this.addCurrencyToUrl(req, currency)),
        switchMap((newReq) => handle(newReq))
      );
  }

  protected addCurrencyToUrl(req: Request, currency: string): Request {
    const urlObject = new URL(req.url);
    if (urlObject.searchParams.has(this.parameterName)) return req; // we don't want to override currency, if set
    urlObject.searchParams.set(this.parameterName, currency);
    return new Request(urlObject.toString(), req);
  }

  shouldInterceptRequest({ url }: Request): boolean {
    if (!this.SCOS_BASE_URL || !url.startsWith(this.SCOS_BASE_URL))
      return false;

    const path = url.substring(this.SCOS_BASE_URL.length);

    for (const endpoint of this.includedEndpoints) {
      if (path.startsWith(`/${endpoint}`)) return true;
    }
    return false;
  }
}
