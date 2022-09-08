import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { RouteParams, RouterService } from '@spryker-oryx/experience';
import {
  DefaultProductListPageService,
  DefaultProductListService,
  ProductListAdapter,
  ProductService,
} from '@spryker-oryx/product';
import { siteProviders } from '@spryker-oryx/site';
import { delay, Observable, of, ReplaySubject } from 'rxjs';
import { ProductListPageService, ProductListService } from '../services';
import { MockProductService } from './mock-product.service';
import { MockProductListAdapter } from './product-list/mock-product-list.adapter';

class MockRouterService implements Partial<RouterService> {
  private params$ = new ReplaySubject<RouteParams>(1);

  currentParams(): Observable<RouteParams> {
    return this.params$;
  }

  acceptParams(params: RouteParams): void {
    this.params$.next(params);
  }
}

export const mockCartProviders = [
  {
    provide: 'FES.CartService',
    useValue: {
      addEntry: (): Observable<null> => of(null).pipe(delay(1000)),
    },
  },
];

export const semanticLinkProviders = [
  {
    provide: 'FES.SemanticLinkService',
    useValue: {
      get: (): Observable<string> =>
        of(window.parent?.location.href ?? window.location.href),
    },
  },
];

export const mockProductProviders = [
  {
    provide: ContextService,
    useClass: DefaultContextService,
  },
  {
    provide: ProductService,
    useClass: MockProductService,
  },
  ...siteProviders,
  ...semanticLinkProviders,
  ...mockCartProviders,
];

export const mockProductListProviders = [
  ...mockProductProviders,
  {
    provide: ProductListService,
    useClass: DefaultProductListService,
  },
  {
    provide: RouterService,
    useClass: MockRouterService,
  },
  {
    provide: ProductListPageService,
    useClass: DefaultProductListPageService,
  },
  {
    provide: ProductListAdapter,
    useClass: MockProductListAdapter,
  },
];
