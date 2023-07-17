import { DefaultQueryService, QueryService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Observable, of, switchMap, take } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ProductListQualifier } from '../../models';
import { ProductListAdapter } from './adapter';
import { DefaultProductListService } from './default-product-list.service';
import { ProductListService } from './product-list.service';

const mockList = [{ name: 'test1' }, { name: 'test2' }];

class MockProductListAdapter implements Partial<ProductListAdapter> {
  getKey = (qualifier: ProductListQualifier): string => qualifier.q!;
  get = vi
    .fn()
    .mockImplementation((qualifier: ProductListQualifier) => of(mockList));
}

describe('DefaultProductService', () => {
  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  let service: ProductListService;
  let adapter: ProductListAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ProductListService,
          useClass: DefaultProductListService,
        },
        {
          provide: ProductListAdapter,
          useClass: MockProductListAdapter,
        },
        {
          provide: QueryService,
          useClass: DefaultQueryService,
        },
      ],
    });

    service = testInjector.inject(ProductListService);
    adapter = testInjector.inject(ProductListAdapter);
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultProductListService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with a product from adapter', () => {
      const callback = vi.fn();
      service.get({ q: 'test' }).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(expect.objectContaining(mockList));
    });

    it('should call `get` method of adapter only for getting new product', () => {
      service.get({ q: 'test' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.get({ q: 'test' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.get({ q: 'another test' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(2);
    });

    it('should return an observable with null if error has been caught', () => {
      (adapter.get as unknown as SpyInstance).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw 'error';
          })
        )
      );
      const callback = vi.fn();
      service.get({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getState', () => {
    it('should return an observable', () => {
      expect(service.getState({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with a state', () => {
      const callback = vi.fn();
      service.getState({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ data: mockList })
      );
    });

    it('should return an observable with error state if error has been caught', () => {
      const testError = new Error();
      (adapter.get as unknown as SpyInstance).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw testError;
          })
        )
      );
      const callback = vi.fn();
      service.getState({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ data: undefined, error: testError })
      );
    });
  });
});
