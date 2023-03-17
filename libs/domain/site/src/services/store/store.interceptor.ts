import {
  HttpHandlerFn,
  HttpInterceptor,
  RequestOptions,
} from '@spryker-oryx/core';
import { inject, INJECTOR } from '@spryker-oryx/di';
import { Observable, switchMap, take } from 'rxjs';
import { StoreService } from './store.service';

export class StoreInterceptor implements HttpInterceptor {
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
    const storeService = this.injector.inject(StoreService);

    return storeService.getAll().pipe(
      take(1),
      switchMap((stores) =>
        stores.length <= 1
          ? handle(url, options)
          : storeService.get().pipe(
              switchMap((store) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                handle(url, this.addStoreHeader(options, store!.id))
              )
            )
      )
    );
  }

  protected addStoreHeader(
    options: RequestOptions,
    store: string
  ): RequestOptions {
    return {
      ...options,
      headers: {
        ...options.headers,
        'X-Store': store,
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
