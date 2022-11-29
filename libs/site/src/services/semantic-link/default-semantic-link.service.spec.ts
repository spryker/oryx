import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import {
  DefaultSemanticLinkService,
  SemanticLink,
  SemanticLinkService,
  SemanticLinkType,
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
      const link: SemanticLink = { type: SemanticLinkType.Page, id: 'about' };
      expect(service.get(link)).toBeInstanceOf(Observable);
    });

    describe('when type equal "SemanticLinkType.Page"', () => {
      beforeEach(() => {
        const link: SemanticLink = { type: SemanticLinkType.Page, id: 'about' };
        callback = vi.fn();
        service.get(link).subscribe(callback);
      });

      it('should resolve link to page', () => {
        expect(callback).toHaveBeenCalledWith('/about');
      });
    });

    describe('when type equal "SemanticLinkType.Product"', () => {
      beforeEach(() => {
        const link: SemanticLink = { type: SemanticLinkType.Product, id: '1' };
        callback = vi.fn();
        service.get(link).subscribe(callback);
      });

      it('should resolve link to product', () => {
        expect(callback).toHaveBeenCalledWith('/product/1');
      });
    });

    describe('when type equal "SemanticLinkType.Category"', () => {
      beforeEach(() => {
        const link: SemanticLink = {
          type: SemanticLinkType.Category,
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
            type: SemanticLinkType.Category,
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

    describe('when type equal "SemanticLinkType.Checkout"', () => {
      beforeEach(() => {
        const link: SemanticLink = {
          type: SemanticLinkType.Checkout,
        };
        callback = vi.fn();
        service.get(link).subscribe(callback);
      });

      it('should resolve link to checkout page', () => {
        expect(callback).toHaveBeenCalledWith('/checkout');
      });
    });

    describe('when type equal "SemanticLinkType.ProductList"', () => {
      beforeEach(() => {
        const link: SemanticLink = {
          type: SemanticLinkType.ProductList,
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
            type: SemanticLinkType.ProductList,
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
            type: SemanticLinkType.ProductList,
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
