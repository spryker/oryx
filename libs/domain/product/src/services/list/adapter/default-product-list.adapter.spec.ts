import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { ProductListQualifier } from '../../../models';
import { ProductListNormalizer } from '../../adapter';
import { DefaultProductListAdapter } from './default-product-list.adapter';
import { ProductListAdapter } from './product-list.adapter';

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

describe('DefaultProductCategoryAdapter', () => {
  let service: ProductListAdapter;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: ProductListAdapter,
          useClass: DefaultProductListAdapter,
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

    service = testInjector.inject(ProductListAdapter);
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultProductListAdapter);
  });

  describe('get method', () => {
    const mockQualifier: ProductListQualifier = { q: 'test' };

    beforeEach(() => {
      http.flush(mockProducts);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should build correct base url', () => {
      service.get(mockQualifier);

      expect(http.url).toContain(
        `${mockApiUrl}/catalog-search?q=${mockQualifier.q}`
      );
    });

    it('should call transformer with proper normalizer', () => {
      service.get(mockQualifier).subscribe();

      expect(mockTransformer.do).toHaveBeenCalledWith(ProductListNormalizer);
    });

    it('should return transformed data', () => {
      const mockTransformerData = 'mockTransformerData';
      const callback = vi.fn();
      mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

      service.get(mockQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });

  describe('getKey method', () => {
    it('should generate key from query string', () => {
      const query = { q: 'test', brand: 'sony', color: 'red' };
      expect(service.getKey(query)).toBe('q=test&brand=sony&color=red');
    });

    it('should correct transform alias to query string', () => {
      const query = { q: 'test', maxPrice: 12, minPrice: 1 };
      expect(service.getKey(query)).toBe('q=test&price[max]=12&price[min]=1');
    });

    it('should generate empty string when query param is not provided', () => {
      expect(service.getKey({})).toBe('');
    });
  });
});
