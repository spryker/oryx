import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { RouteLinkType } from '@spryker-oryx/router/lit';
import {
  DefaultSemanticLinkService,
  SemanticLink,
  SemanticLinkService,
} from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';

const mockRouterService = {
  getRoutes: vi.fn(),
};

describe('DefaultLinkService', () => {
  let service: SemanticLinkService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: SemanticLinkService,
          useClass: DefaultSemanticLinkService,
        },
        {
          provide: RouterService,
          useValue: mockRouterService,
        },
      ],
    });

    service = testInjector.inject(SemanticLinkService);
    mockRouterService.getRoutes.mockReturnValue(
      of([
        {
          path: '/:page',
          name: 'Page',
          type: RouteLinkType.Page,
        },
      ])
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultSemanticLinkService);
  });

  describe('get method', () => {
    const callback = vi.fn();

    it('should return an observable', () => {
      const link = { type: RouteLinkType.Page, id: 'about' };
      expect(service.get(link)).toBeInstanceOf(Observable);
    });

    describe('when type equal "RouteLinkType.Page"', () => {
      beforeEach(() => {
        const link: SemanticLink = { type: RouteLinkType.Page, id: 'about' };
        service.get(link).subscribe(callback);
      });

      it('should resolve link to page', () => {
        expect(callback).toHaveBeenCalledWith('/about');
      });
    });

    describe('when type equal "RouteLinkType.Product"', () => {
      beforeEach(() => {
        mockRouterService.getRoutes.mockReturnValue(
          of([
            {
              path: '/product/:id',
              name: 'Page',
              type: RouteLinkType.Product,
            },
          ])
        );
        const link: SemanticLink = { type: RouteLinkType.Product, id: '1' };
        service.get(link).subscribe(callback);
      });

      it('should resolve link to product', () => {
        expect(callback).toHaveBeenCalledWith('/product/1');
      });
    });

    describe('when type equal "RouteLinkType.Category"', () => {
      beforeEach(() => {
        mockRouterService.getRoutes.mockReturnValue(
          of([
            {
              path: '/category/:id',
              name: 'Page',
              type: RouteLinkType.Category,
            },
          ])
        );
        const link: SemanticLink = {
          type: RouteLinkType.Category,
          id: 'laptops',
        };
        service.get(link).subscribe(callback);
      });

      it('should resolve link to category page', () => {
        expect(callback).toHaveBeenCalledWith('/category/laptops');
      });

      describe('and link contains params', () => {
        beforeEach(() => {
          const link: SemanticLink = {
            type: RouteLinkType.Category,
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
        const link: SemanticLink = {
          type: RouteLinkType.Cart,
        };
        service.get(link).subscribe(callback);
      });

      it('should resolve link to cart page', () => {
        expect(callback).toHaveBeenCalledWith('/cart');
      });
    });

    describe('when type equal "RouteLinkType.ProductList"', () => {
      describe('and link contains params', () => {
        beforeEach(() => {
          const link: SemanticLink = {
            type: RouteLinkType.ProductList,
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
          const link: SemanticLink = {
            type: RouteLinkType.ProductList,
          };
          service.get(link).subscribe(callback);
        });

        it('should resolve link to search page', () => {
          expect(callback).toHaveBeenCalledWith('/search');
        });
      });
    });
  });
});
