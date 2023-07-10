import { DefaultQueryService, QueryService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { ProductQualifier } from '../models/product-qualifier';
import { Product } from '../models/product.model';
import { ProductRelationsListAdapter } from './adapter/product-relations-list.adapter';
import { DefaultProductRelationsListService } from './default-product-relations-list.service';
import { ProductRelationsListService } from './product-relations-list.service';

const mockAdapterData: Product[] = [{ sku: '1' }, { sku: '2' }];

class MockProductRelationsListAdapter
  implements Partial<ProductRelationsListAdapter>
{
  get = vi
    .fn()
    .mockImplementation((qualifier: ProductQualifier) => of(mockAdapterData));
}

describe('DefaultProductRelationsListService', () => {
  let service: ProductRelationsListService;
  let adapter: ProductRelationsListAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ProductRelationsListService,
          useClass: DefaultProductRelationsListService,
        },
        {
          provide: ProductRelationsListAdapter,
          useClass: MockProductRelationsListAdapter,
        },
        {
          provide: QueryService,
          useClass: DefaultQueryService,
        },
      ],
    });

    service = testInjector.inject(ProductRelationsListService);
    adapter = testInjector.inject(ProductRelationsListAdapter);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultProductRelationsListService);
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
