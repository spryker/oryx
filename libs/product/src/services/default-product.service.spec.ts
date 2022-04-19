import { Injector } from '@spryker-oryx/injector';
import { Observable, of } from 'rxjs';
import { ProductDomain, ProductQualifier } from '../models';
import { ProductAdapter } from './adapter/product.adapter';
import { DefaultProductService } from './default-product.service';
import { ProductService } from './product.service';

class MockProductAdapter implements Partial<ProductAdapter> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  getKey = (qualifier: ProductQualifier): string => qualifier.sku!;
  get = vi
    .fn()
    .mockImplementation((qualifier: ProductQualifier) =>
      of({ name: `adapter ${qualifier.sku}` })
    );
}

describe('DefaultProductService', () => {
  let service: ProductService;
  let adapter: ProductAdapter;
  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
      {
        provide: ProductDomain.ProductService,
        useClass: DefaultProductService,
      },
      {
        provide: ProductDomain.ProductAdapter,
        useClass: MockProductAdapter,
      },
    ]);

    service = testInjector.inject(ProductDomain.ProductService);
    adapter = testInjector.inject(ProductDomain.ProductAdapter);
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultProductService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with a product from adapter', () => {
      const callback = vi.fn();
      service.get({ sku: '123' }).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'adapter 123' })
      );
    });

    it('should call `get` method of adapter only for getting new product', () => {
      service.get({ sku: '123' });
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.get({ sku: '123' });
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.get({ sku: '124' });
      expect(adapter.get).toHaveBeenCalledTimes(2);
    });
  });
});
