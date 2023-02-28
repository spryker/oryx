import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import * as litRxjs from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ProductContext, ProductService } from '../services';
import { ProductController } from './product.controller';

const mockSku = 'mockSku';
const mockThis = {} as LitElement;

const mockContext = {
  get: vi.fn().mockReturnValue(of(mockSku)),
};
vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

const mockObserve = {
  get: vi.fn(),
};
vi.spyOn(litRxjs, 'ObserveController') as SpyInstance;
(litRxjs.ObserveController as unknown as SpyInstance).mockReturnValue(
  mockObserve
);

const mockProduct = {
  product: 'product',
};

const callback = vi.fn();

describe('ProductController', () => {
  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when product service is provided', () => {
    let productService: ProductService;

    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: ProductService,
            useValue: {
              get: vi.fn().mockReturnValue(of(mockProduct)),
            },
          },
        ],
      });

      productService = testInjector.inject(ProductService);
    });

    // Real example first initialization
    it('should expose the product based on the context', () => {
      const mockObserveReturn = 'mockObserveReturn';
      mockObserve.get.mockReturnValue(mockObserveReturn); // this.observe.get('sku') emission
      const productController = new ProductController(mockThis);
      productController.getProduct().subscribe(callback);

      expect(mockObserve.get).toHaveBeenNthCalledWith(1, 'sku');
      expect(mockContext.get).toHaveBeenCalledWith(
        ProductContext.SKU,
        mockObserveReturn
      );
      expect(productService.get).toHaveBeenCalledWith({
        sku: mockSku,
      });
      expect(callback).toHaveBeenCalledWith(mockProduct);
    });

    // Real example PDP navigation between different products
    describe('when ContextController has multiple emission by `ProductContext.SKU`', () => {
      it('should expose the null and product based on the context on the second emission', async () => {
        const mockObserveReturn = 'mockObserveReturn';
        const skuTrigger = new BehaviorSubject(mockSku);
        mockObserve.get.mockReturnValueOnce(of(null)); // this.observe.get('product') emission
        mockObserve.get.mockReturnValue(mockObserveReturn); // this.observe.get('sku') emission
        mockContext.get.mockReturnValue(skuTrigger);
        const productController = new ProductController(mockThis);

        productController.getProduct().subscribe(callback);
        skuTrigger.next(mockSku); // second ContextController emission

        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenNthCalledWith(1, mockProduct);
        expect(callback).toHaveBeenNthCalledWith(2, undefined);
        expect(callback).toHaveBeenNthCalledWith(3, mockProduct);
      });
    });
  });

  describe('when product service is not provided', () => {
    it('should not expose product data', () => {
      mockObserve.get.mockReturnValue(of(null));
      const productController = new ProductController(mockThis);
      productController.getProduct().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(undefined);
    });
  });
});
