import { HttpHandlerFn, HttpInterceptor } from '@spryker-oryx/core';
import { inject, INJECTOR } from '@spryker-oryx/di';
import { Observable, switchMap, take } from 'rxjs';
import { StoreService } from './store.service';

export class StoreInterceptor implements HttpInterceptor {
  protected excludedEndpoints = ['store'];

  constructor(
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected injector = inject(INJECTOR)
  ) {}

  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    const storeService = this.injector.inject(StoreService);

    return storeService.getAll().pipe(
      take(1),
      switchMap((stores) =>
        stores.length <= 1
          ? handle(req)
          : storeService.get().pipe(
              switchMap((store) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                handle(this.addStoreHeader(req, store!.id))
              )
            )
      )
    );
  }

  protected addStoreHeader(req: Request, store: string): Request {
    const newReq = req.clone();

    newReq.headers.set('X-Store', store);

    return newReq;
  }

  shouldInterceptRequest({ url }: Request): boolean {
    if (!this.SCOS_BASE_URL || !url.startsWith(this.SCOS_BASE_URL))
      return false;

    const path = url.substring(this.SCOS_BASE_URL.length);

    for (const endpoint of this.excludedEndpoints) {
      if (path.startsWith(`/${endpoint}`)) return false;
    }
    return true;
  }
}
