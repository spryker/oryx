import { HttpHandlerFn, HttpInterceptor } from '@spryker-oryx/core';
import { INJECTOR, inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, map, switchMap, take } from 'rxjs';

export class AcceptLanguageInterceptor implements HttpInterceptor {
  protected headerName = 'Accept-Language';

  protected excludedEndpoints = ['/store', '/token'];

  constructor(
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected injector = inject(INJECTOR)
  ) {}

  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    return this.injector
      .inject(LocaleService)
      .get()
      .pipe(
        take(1),
        map((locale) => this.addLanguageHeader(locale, req)),
        switchMap((newReq) => handle(newReq))
      );
  }

  protected addLanguageHeader(locale: string, req: Request): Request {
    const newReq = req.clone();

    newReq.headers.set(this.headerName, locale);

    return newReq;
  }

  shouldInterceptRequest({ url }: Request): boolean {
    if (!this.SCOS_BASE_URL || !url.startsWith(this.SCOS_BASE_URL)) {
      return false;
    }

    const path = new URL(url).pathname;

    return !this.excludedEndpoints.some((endpoint) =>
      path.startsWith(endpoint)
    );
  }
}
