import { resolve } from '@spryker-oryx/injector';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import { ProductContext } from '../models';
import { ProductService } from '../services';
import { ProductController } from './product.controller';

const mockSku = 'mockSku';
const mockThis = {} as LitElement;
const mockContextGet = vi.fn();
const mockInclude = ['includeA', 'includeB'];

vi.mock('@spryker-oryx/core', () => ({
  ContextController: class {
    get = mockContextGet.mockReturnValue(of(mockSku));
  },
}));

const mockObserveGet = vi.fn();
const mockObserveReturn = 'mockObserveReturn';

vi.mock('@spryker-oryx/lit-rxjs', () => ({
  ObserveController: class {
    get = mockObserveGet.mockReturnValue(mockObserveReturn);
  },
}));

const mockGet = vi.fn();
const mockProduct = {
  product: 'product',
};

vi.mock('@spryker-oryx/injector', () => ({
  resolve: vi.fn().mockReturnValue({
    get: (data: unknown) => mockGet.mockReturnValue(of(mockProduct))(data),
  }),
}));

describe('ProductController', () => {
  it('should expose the product based on the context', () => {
    const productController = new ProductController(mockThis, mockInclude);
    const callback = vi.fn();
    productController.getProduct().subscribe(callback);

    expect(resolve).toHaveBeenCalledWith(productController, ProductService);
    expect(mockObserveGet).toHaveBeenCalledWith('sku');
    expect(mockContextGet).toHaveBeenCalledWith(
      ProductContext.Code,
      mockObserveReturn
    );
    expect(mockGet).toHaveBeenCalledWith({
      sku: mockSku,
      include: mockInclude,
    });
    expect(callback).toHaveBeenCalledWith(mockProduct);
  });
});
