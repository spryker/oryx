import { ContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { of } from 'rxjs';
import { ProductService } from '../product.service';
import { ProductPageTitleMetaResolver } from './product-page-title-meta.resolver';

const mockProductService = {
  get: vi.fn(),
};

const mockContextService = {
  get: vi.fn(),
};

const mockRouterService = {
  currentRoute: vi.fn(),
};

describe('ProductPageTitleMetaResolver', () => {
  let service: ProductPageTitleMetaResolver;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ProductPageTitleMetaResolver,
          useClass: ProductPageTitleMetaResolver,
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

    service = testInjector.inject(ProductPageTitleMetaResolver);
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

  describe('resolve', () => {
    it('should return proper object with product title', () => {
      const callback = vi.fn();
      mockContextService.get.mockReturnValue(of('sku'));
      mockProductService.get.mockReturnValue(
        of({
          name: 'Name A',
        })
      );
      service.resolve().subscribe(callback);
      expect(mockProductService.get).toHaveBeenCalledWith({ sku: 'sku' });
      expect(callback).toHaveBeenCalledWith({
        title: 'Name A',
      });
    });
  });
});
