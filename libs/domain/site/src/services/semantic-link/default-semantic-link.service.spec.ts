import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouteLinkType } from '@spryker-oryx/router/lit';
import {
  DefaultSemanticLinkService,
  SemanticLink,
  SemanticLinkService,
} from '@spryker-oryx/site';
import { Observable } from 'rxjs';

describe('DefaultLinkService', () => {
  let service: SemanticLinkService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: SemanticLinkService,
          useClass: DefaultSemanticLinkService,
        },
      ],
    });

    service = testInjector.inject(SemanticLinkService);
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultSemanticLinkService);
  });

  describe('get method', () => {
    let callback: any;

    it('should return an observable', () => {
      const link: SemanticLink = { type: RouteLinkType.Page, id: 'about' };
      expect(service.get(link)).toBeInstanceOf(Observable);
    });

    describe('when type equal "RouteLinkType.Page"', () => {
      beforeEach(() => {
        const link: SemanticLink = { type: RouteLinkType.Page, id: 'about' };
        callback = vi.fn();
        service.get(link).subscribe(callback);
      });

      it('should resolve link to page', () => {
        expect(callback).toHaveBeenCalledWith('/about');
      });
    });

    describe('when type equal "RouteLinkType.Product"', () => {
      beforeEach(() => {
        const link: SemanticLink = { type: RouteLinkType.Product, id: '1' };
        callback = vi.fn();
        service.get(link).subscribe(callback);
      });

      it('should resolve link to product', () => {
        expect(callback).toHaveBeenCalledWith('/product/1');
      });
    });

    describe('when type equal "RouteLinkType.Category"', () => {
      beforeEach(() => {
        const link: SemanticLink = {
          type: RouteLinkType.Category,
          id: 'laptops',
        };
        callback = vi.fn();
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
          callback = vi.fn();
          service.get(link).subscribe(callback);
        });

        it('should resolve link to category page with encoded params', () => {
          expect(callback).toHaveBeenCalledWith(
            '/category/laptops?param1=1&param2=2'
          );
        });
      });
    });

    describe('when type equal "RouteLinkType.Cart"', () => {
      beforeEach(() => {
        const link: SemanticLink = {
          type: RouteLinkType.Cart,
        };
        callback = vi.fn();
        service.get(link).subscribe(callback);
      });

      it('should resolve link to cart page', () => {
        expect(callback).toHaveBeenCalledWith('/cart');
      });
    });

    describe('when type equal "RouteLinkType.Checkout"', () => {
      beforeEach(() => {
        const link: SemanticLink = {
          type: RouteLinkType.Checkout,
        };
        callback = vi.fn();
        service.get(link).subscribe(callback);
      });

      it('should resolve link to checkout page', () => {
        expect(callback).toHaveBeenCalledWith('/checkout');
      });
    });

    describe('when type equal "RouteLinkType.ProductList"', () => {
      beforeEach(() => {
        const link: SemanticLink = {
          type: RouteLinkType.ProductList,
          id: '?test=test',
        };
        callback = vi.fn();
        service.get(link).subscribe(callback);
      });

      it('should resolve encoded link to search with id', () => {
        expect(callback).toHaveBeenCalledWith('/search%3Ftest%3Dtest');
      });

      describe('and link contains params', () => {
        beforeEach(() => {
          const link: SemanticLink = {
            type: RouteLinkType.ProductList,
            params: { param1: '1', param2: '2' },
          };
          callback = vi.fn();
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
          callback = vi.fn();
          service.get(link).subscribe(callback);
        });

        it('should resolve link to search page', () => {
          expect(callback).toHaveBeenCalledWith('/search');
        });
      });
    });
  });
});
