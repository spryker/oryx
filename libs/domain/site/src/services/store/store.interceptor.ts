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
    protected STORE = inject('STORE'),
    protected injector = inject(INJECTOR)
  ) {}

  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    return this.injector
      .inject(StoreService)
      .getAll()
      .pipe(
        take(1),
        switchMap((stores) =>
          stores.length <= 1
            ? handle(url, options)
            : handle(url, this.addStoreHeader(options))
        )
      );
  }

  protected addStoreHeader(options: RequestOptions): RequestOptions {
    return {
      ...options,
      headers: {
        ...options.headers,
        'X-Store': this.STORE,
      } as HeadersInit,
    };
  }

  shouldInterceptRequest(url: string): boolean {
    if (!url.startsWith(this.SCOS_BASE_URL)) return false;

    const path = url.substring(this.SCOS_BASE_URL.length);

    for (const endpoint of this.excludedEndpoints) {
      if (path.startsWith(`/${endpoint}`)) return false;
    }
    return true;
  }
}
