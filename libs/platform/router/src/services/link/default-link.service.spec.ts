import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouteType, RouterService } from '@spryker-oryx/router';
import { Observable, of } from 'rxjs';
import { DefaultLinkService } from './default-link.service';
import { LinkOptions, LinkService } from './link.service';

const mockRouterService = {
  getRoutes: vi.fn(),
  currentRoute: vi.fn(),
};

describe('DefaultLinkService', () => {
  let service: LinkService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: LinkService,
          useClass: DefaultLinkService,
        },
        {
          provide: RouterService,
          useValue: mockRouterService,
        },
      ],
    });

    service = testInjector.inject(LinkService);
    mockRouterService.getRoutes.mockReturnValue(
      of([
        {
          path: '/:page',
          name: 'Page',
          type: RouteType.Page,
        },
      ])
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultLinkService);
  });

  describe('get method', () => {
    const callback = vi.fn();

    it('should return an observable', () => {
      const link = { type: RouteType.Page, id: 'about' };
      expect(service.get(link)).toBeInstanceOf(Observable);
    });

    describe('when type equal "RouteType.Page"', () => {
      beforeEach(() => {
        const link: LinkOptions = { type: RouteType.Page, id: 'about' };
        service.get(link).subscribe(callback);
      });

      it('should resolve link to page', () => {
        expect(callback).toHaveBeenCalledWith('/about');
      });
    });

    describe('when type equal "RouteType.Product"', () => {
      beforeEach(() => {
        mockRouterService.getRoutes.mockReturnValue(
          of([
            {
              path: '/product/:id',
              name: 'Page',
              type: RouteType.Product,
            },
          ])
        );
        const link: LinkOptions = { type: RouteType.Product, id: '1' };
        service.get(link).subscribe(callback);
      });

      it('should resolve link to product', () => {
        expect(callback).toHaveBeenCalledWith('/product/1');
      });
    });

    describe('when type equal "RouteType.Category"', () => {
      beforeEach(() => {
        mockRouterService.getRoutes.mockReturnValue(
          of([
            {
              path: '/category/:id',
              name: 'Page',
              type: RouteType.Category,
            },
          ])
        );
        const link: LinkOptions = {
          type: RouteType.Category,
          id: 'laptops',
        };
        service.get(link).subscribe(callback);
      });

      it('should resolve link to category page', () => {
        expect(callback).toHaveBeenCalledWith('/category/laptops');
      });

      describe('and link contains params', () => {
        beforeEach(() => {
          const link: LinkOptions = {
            type: RouteType.Category,
            id: 'laptops',
            params: { param1: '1', param2: '2' },
          };
          service.get(link).subscribe(callback);
        });

        it('should resolve link to category page with encoded params', () => {
          expect(callback).toHaveBeenCalledWith(
            '/category/laptops?param1=1&param2=2'
          );
        });
      });
    });

    describe('when just type is defined', () => {
      beforeEach(() => {
        const link: LinkOptions = {
          type: RouteType.Cart,
        };
        service.get(link).subscribe(callback);
      });

      it('should resolve link to cart page', () => {
        expect(callback).toHaveBeenCalledWith('/cart');
      });
    });

    describe('when type equal "RouteType.ProductList"', () => {
      describe('and link contains params', () => {
        beforeEach(() => {
          const link: LinkOptions = {
            type: RouteType.ProductList,
            params: { param1: '1', param2: '2' },
          };
          service.get(link).subscribe(callback);
        });

        it('should resolve link to search with encoded params', () => {
          expect(callback).toHaveBeenCalledWith('/search?param1=1&param2=2');
        });
      });

      describe('and "id" is not provided', () => {
        beforeEach(() => {
          const link: LinkOptions = {
            type: RouteType.ProductList,
          };
          service.get(link).subscribe(callback);
        });

        it('should resolve link to search page', () => {
          expect(callback).toHaveBeenCalledWith('/search');
        });
      });
    });
  });

  describe('isCurrent method', () => {
    const callback = vi.fn();

    describe('when the current route exactly matches the provided URL', () => {
      beforeEach(async () => {
        mockRouterService.currentRoute.mockReturnValue(of('/about'));
        service.isCurrent('/about', true).subscribe(callback);
      });

      it('should resolve to true', () => {
        expect(callback).toHaveBeenCalledWith(true);
      });
    });

    describe('when the current route overlaps another URL', () => {
      beforeEach(() => {
        mockRouterService.currentRoute.mockReturnValue(of('/about-us'));
        service.isCurrent('/about').subscribe(callback);
      });

      it('should resolve to false', () => {
        expect(callback).toHaveBeenCalledWith(false);
      });
    });

    describe('when the current route starts with the provided URL', () => {
      beforeEach(() => {
        mockRouterService.currentRoute.mockReturnValue(of('/about/us'));
        service.isCurrent('/about').subscribe(callback);
      });

      it('should resolve to true', () => {
        expect(callback).toHaveBeenCalledWith(true);
      });
    });

    describe('when the current route does not match the provided URL', () => {
      beforeEach(() => {
        mockRouterService.currentRoute.mockReturnValue(of('/contact'));
        service.isCurrent('/about').subscribe(callback);
      });

      it('should resolve to false', () => {
        expect(callback).toHaveBeenCalledWith(false);
      });
    });

    describe('when the current route exactly matches but exactMatch is false', () => {
      beforeEach(() => {
        mockRouterService.currentRoute.mockReturnValue(of('/about'));
        service.isCurrent('/about', false).subscribe(callback);
      });

      it('should resolve to true', () => {
        expect(callback).toHaveBeenCalledWith(true);
      });
    });

    describe('when the current route starts with but exactMatch is false', () => {
      beforeEach(() => {
        mockRouterService.currentRoute.mockReturnValue(of('/about'));
        service.isCurrent('/about/us', false).subscribe(callback);
      });

      it('should resolve to true', () => {
        expect(callback).toHaveBeenCalledWith(false);
      });
    });
  });
});
