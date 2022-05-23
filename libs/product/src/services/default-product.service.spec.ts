import { Injector } from '@spryker-oryx/injector';
import { Observable, of, switchMap } from 'rxjs';
import { SpyInstanceFn } from 'vitest';
import { ProductQualifier } from '../models';
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
        provide: ProductService,
        useClass: DefaultProductService,
      },
      {
        provide: ProductAdapter,
        useClass: MockProductAdapter,
      },
    ]);

    service = testInjector.inject(ProductService);
    adapter = testInjector.inject(ProductAdapter);
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

    it('should return an observable with null if error has been caught', () => {
      (adapter.get as SpyInstanceFn).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw 'error';
          })
        )
      );
      const callback = vi.fn();
      service.get({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe('getError', () => {
    const mockObjectError = {
      status: 0,
      statusCode: 1,
    };

    beforeEach(() => {
      (adapter.get as SpyInstanceFn).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw mockObjectError;
          })
        )
      );
    });

    it('should return an observable', () => {
      expect(service.getError({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with an error information', () => {
      const callback = vi.fn();
      service.getError({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockObjectError);
    });

    it('should call `get` method of adapter only for getting new product', () => {
      service.getError({ sku: '123' });
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.getError({ sku: '123' });
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.getError({ sku: '124' });
      expect(adapter.get).toHaveBeenCalledTimes(2);
    });
  });
});
