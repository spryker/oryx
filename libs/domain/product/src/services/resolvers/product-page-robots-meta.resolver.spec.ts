import { ContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Product } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import { of } from 'rxjs';
import { ProductService } from '../product.service';
import { ProductPageRobotMetaResolver } from './product-page-robots-meta.resolver';

const mockProductService = {
  get: vi.fn(),
};

const mockContextService = {
  get: vi.fn(),
};

const mockRouterService = {
  currentRoute: vi.fn(),
};

describe('ProductPageRobotMetaResolver', () => {
  let service: ProductPageRobotMetaResolver;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ProductPageRobotMetaResolver,
          useClass: ProductPageRobotMetaResolver,
        },
        {
          provide: ContextService,
          useValue: mockContextService,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: RouterService,
          useValue: mockRouterService,
        },
      ],
    });

    service = testInjector.inject(ProductPageRobotMetaResolver);
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  describe('getScore', () => {
    it('should return proper value if product exist', () => {
      const callback = vi.fn();
      mockContextService.get.mockReturnValue(of('sku'));
      mockRouterService.currentRoute.mockReturnValue(of('/product/saf'));
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(['sku', true]);
    });

    it('should return proper value if product is not exist', () => {
      const callback = vi.fn();
      mockContextService.get.mockReturnValue(of(undefined));
      mockRouterService.currentRoute.mockReturnValue(of(''));

      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([undefined, false]);
    });
  });

  const callback = vi.fn();

  describe('when the product is discontinued', () => {
    describe('and has no stock available', () => {
      beforeEach(() => {
        mockContextService.get.mockReturnValue(of('sku'));
        mockProductService.get.mockReturnValue(
          of({ discontinued: true, availability: { quantity: 0 } } as Product)
        );
        service.resolve().subscribe(callback);
      });

      it('should resolve a robot meta info with "noindex, follow"', () => {
        expect(callback).toHaveBeenCalledWith({
          robots: 'noindex,follow',
        });
      });
    });

    describe('and has stock available', () => {
      beforeEach(() => {
        mockContextService.get.mockReturnValue(of('sku'));
        mockProductService.get.mockReturnValue(
          of({ discontinued: true, availability: { quantity: 1 } } as Product)
        );
        service.resolve().subscribe(callback);
      });

      it('should resolve a robot meta info with "index, follow"', () => {
        expect(callback).toHaveBeenCalledWith({
          robots: 'index,follow',
        });
      });
    });
  });

  describe('when the product is not discontinued', () => {
    beforeEach(() => {
      mockContextService.get.mockReturnValue(of('sku'));
      mockProductService.get.mockReturnValue(of({} as Product));
      service.resolve().subscribe(callback);
    });

    it('should resolve a robot meta info with "index, follow"', () => {
      expect(callback).toHaveBeenCalledWith({
        robots: 'index,follow',
      });
    });
  });
});
