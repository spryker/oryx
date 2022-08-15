import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import * as litRxjs from '@spryker-oryx/lit-rxjs';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ProductContext } from '../models';
import { ProductService } from '../services';
import { ProductController } from './product.controller';

const mockSku = 'mockSku';
const mockThis = {} as LitElement;
const mockWithProduct = { product: { name: 'test' } };
const mockInclude = ['includeA', 'includeB'];

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

    it('should expose the product based on the context', () => {
      const mockObserveReturn = 'mockObserveReturn';
      mockObserve.get.mockImplementation((key) =>
        key !== 'product' ? mockObserveReturn : of(null)
      );
      const productController = new ProductController(mockThis, mockInclude);
      const callback = vi.fn();
      productController.getProduct().subscribe(callback);

      expect(mockObserve.get).toHaveBeenNthCalledWith(1, 'product');
      expect(mockObserve.get).toHaveBeenNthCalledWith(2, 'sku');
      expect(mockContext.get).toHaveBeenCalledWith(
        ProductContext.SKU,
        mockObserveReturn
      );
      expect(productService.get).toHaveBeenCalledWith({
        sku: mockSku,
        include: mockInclude,
      });
      expect(callback).toHaveBeenCalledWith(mockProduct);
    });

    it('should expose the product from the host "product" property', () => {
      mockObserve.get.mockReturnValue(of(mockWithProduct.product));
      const productController = new ProductController(
        mockWithProduct as unknown as LitElement
      );
      const callback = vi.fn();
      productController.getProduct().subscribe(callback);

      expect(mockObserve.get).toHaveBeenCalledWith('product');
      expect(mockContext.get).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith((mockWithProduct as any).product);
    });
  });

  describe('when product service is not provided', () => {
    it('should not expose product data', () => {
      mockObserve.get.mockReturnValue(of(null));
      const productController = new ProductController(mockThis);
      const callback = vi.fn();
      productController.getProduct().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(null);
    });
  });
});
