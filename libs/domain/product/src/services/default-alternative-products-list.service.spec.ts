import { DefaultQueryService, QueryService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { ProductQualifier } from '../models/product-qualifier';
import { Product } from '../models/product.model';
import { AlternativeProductsListAdapter } from './adapter/alternative-products-list.adapter';
import { AlternativeProductsListService } from './alternative-products-list.service';
import { DefaultAlternativeProductsListService } from './default-alternative-products-list.service';

const mockAdapterData: Product[] = [{ sku: '1' }, { sku: '2' }];

class MockAlternativeProductsListAdapter
  implements Partial<AlternativeProductsListAdapter>
{
  get = vi
    .fn()
    .mockImplementation((qualifier: ProductQualifier) => of(mockAdapterData));
}

describe('DefaultAlternativeProductsListService', () => {
  let service: AlternativeProductsListService;
  let adapter: AlternativeProductsListAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AlternativeProductsListService,
          useClass: DefaultAlternativeProductsListService,
        },
        {
          provide: AlternativeProductsListAdapter,
          useClass: MockAlternativeProductsListAdapter,
        },
        {
          provide: QueryService,
          useClass: DefaultQueryService,
        },
      ],
    });

    service = testInjector.inject(AlternativeProductsListService);
    adapter = testInjector.inject(AlternativeProductsListAdapter);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultAlternativeProductsListService);
  });

  describe('get', () => {
    it('should return an observable with a product from adapter', () => {
      const callback = vi.fn();
      service.get({ sku: 'test' }).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining(mockAdapterData)
      );
    });
  });
});
