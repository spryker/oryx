import { HttpHandlerFn, HttpInterceptor } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, map, switchMap, take } from 'rxjs';
import { PriceModeService } from './price-mode.service';

export class PriceModeInterceptor implements HttpInterceptor {
  protected parameterName = 'priceMode';

  protected includedEndpoints = [
    'concrete-products',
    'catalog-search',
    'catalog-search-suggestions',
  ];

  constructor(
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected priceModeService = inject(PriceModeService)
  ) {}

  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    return this.priceModeService.get().pipe(
      take(1),
      map((priceMode) => this.addPriceModeToUrl(req, priceMode)),
      switchMap((newReq) => handle(newReq))
    );
  }

  shouldInterceptRequest({ url }: Request): boolean {
    if (!this.SCOS_BASE_URL || !url.startsWith(this.SCOS_BASE_URL)) {
      return false;
    }

    const path = url.substring(this.SCOS_BASE_URL.length);

    for (const endpoint of this.includedEndpoints) {
      if (path.startsWith(`/${endpoint}`)) {
        return true;
      }
    }

    return false;
  }

  private addPriceModeToUrl(req: Request, priceMode: string): Request {
    const urlObject = new URL(req.url);

    // we don't want to override priceMode, if set
    if (urlObject.searchParams.has(this.parameterName)) {
      return req;
    }

    urlObject.searchParams.set(this.parameterName, priceMode);
    return new Request(urlObject.toString(), req.clone());
  }
}
