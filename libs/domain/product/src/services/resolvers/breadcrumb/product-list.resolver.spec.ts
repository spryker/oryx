import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouteWithParams, RouterService } from '@spryker-oryx/router';
import { of } from 'rxjs';
import {
  ProductListBreadcrumb,
  ProductListBreadcrumbResolver,
} from './product-list.resolver';

const route: Partial<RouteWithParams> = { query: {} };
const routeWithSearch: Partial<RouteWithParams> = { query: { q: 'test' } };

class MockRouterService implements Partial<RouterService> {
  current = vi.fn().mockReturnValue(of(route));
}

describe('ProductListBreadcrumbResolver', () => {
  let service: ProductListBreadcrumbResolver;
  let routerService: MockRouterService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        ProductListBreadcrumb,
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    routerService = testInjector.inject<MockRouterService>(RouterService);
    service = testInjector.inject(ProductListBreadcrumb.provide);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('resolve', () => {
    const callback = vi.fn();

    beforeEach(() => {
      service.resolve().subscribe(callback);
    });

    it('should get the current route', () => {
      expect(routerService.current).toHaveBeenCalled();
    });

    it('should build a breadcrumb with token', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            text: {
              token: 'product.breadcrumb.search',
            },
          },
        ])
      );
    });

    describe('and route contains search query', () => {
      const callback = vi.fn();

      beforeEach(() => {
        routerService.current = vi.fn().mockReturnValue(of(routeWithSearch));
        service.resolve().subscribe(callback);
      });

      it('should build a breadcrumb with token and values', () => {
        expect(callback).toHaveBeenCalledWith(
          expect.arrayContaining([
            {
              text: {
                token: 'product.breadcrumb.search-for-<search>',
                values: { search: `"${routeWithSearch.query?.q}"` },
              },
            },
          ])
        );
      });
    });
  });
});
