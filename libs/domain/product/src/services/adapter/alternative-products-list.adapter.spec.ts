import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { ProductQualifier } from '../../models/product-qualifier';
import { AlternativeProductsListAdapter } from './alternative-products-list.adapter';
import { DefaultAlternativeProductsListAdapter } from './default-alternative-products-list.adapter';
import { AlternativeProductsListNormalizer } from './normalizers/alternative-products-list';

const mockApiUrl = 'mockApiUrl';
const mockProducts = {
  data: [
    {
      attributes: {
        abstractProducts: [],
        concreteProducts: [],
      },
    },
  ],
};

const mockTransformer = {
  do: vi.fn().mockReturnValue(() => of(null)),
};

describe('DefaultAlternativeProductsListAdapter', () => {
  let adapter: AlternativeProductsListAdapter;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: AlternativeProductsListAdapter,
          useClass: DefaultAlternativeProductsListAdapter,
        },
        {
          provide: 'SCOS_BASE_URL',
          useValue: mockApiUrl,
        },
        {
          provide: JsonAPITransformerService,
          useValue: mockTransformer,
        },
      ],
    });

    adapter = testInjector.inject(
      AlternativeProductsListAdapter
    ) as DefaultAlternativeProductsListAdapter;
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(adapter).toBeInstanceOf(DefaultAlternativeProductsListAdapter);
  });

  describe('get method', () => {
    const mockQualifier: ProductQualifier = { sku: 'test' };

    beforeEach(() => {
      http.flush(mockProducts);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should have correct http path', () => {
      adapter.get(mockQualifier);
      expect(http.url).toContain(
        `concrete-products/${mockQualifier.sku}/concrete-alternative-products`
      );
    });

    it('should call transformer with proper normalizer', () => {
      adapter.get(mockQualifier).subscribe();

      expect(mockTransformer.do).toHaveBeenCalledWith(
        AlternativeProductsListNormalizer
      );
    });

    it('should return transformed data', () => {
      const mockTransformerData = 'mockTransformerData';
      const callback = vi.fn();
      mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

      adapter.get(mockQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });
});
