import {
  HttpService,
  IncludesService,
  JsonAPITransformerService,
} from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import { of } from 'rxjs';
import { ApiProductModel, ProductListQualifier } from '../../../models';
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

class MockIncludesService implements Partial<IncludesService> {
  get() {
    return of('');
  }
}

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
        {
          provide: IncludesService,
          useClass: MockIncludesService,
        },
      ],
    });

    service = testInjector.inject(ProductListAdapter);
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultProductListAdapter);
  });

  describe('get method', () => {
    const mockQualifier: ProductListQualifier = { q: 'test' };

    beforeEach(() => {
      http.flush(mockProducts);

      service.get(mockQualifier);
    });

    it('should build correct base url', () => {
      expect(http.url).toContain(
        `${mockApiUrl}/catalog-search?q=${mockQualifier.q}`
      );
    });

    if (featureVersion >= '1.1') {
      describe('category-nodes fields', () => {
        const fields = `fields[${ApiProductModel.Includes.CategoryNodes}]=`;

        it('should add fields for category-nodes to the url', () => {
          expect(http.url).toContain(fields);
        });

        [
          ApiProductModel.CategoryNodeFields.MetaDescription,
          ApiProductModel.CategoryNodeFields.NodeId,
          ApiProductModel.CategoryNodeFields.Order,
          ApiProductModel.CategoryNodeFields.Name,
          ApiProductModel.CategoryNodeFields.Children,
          ApiProductModel.CategoryNodeFields.IsActive,
        ].forEach((field) =>
          it(`should contain ${field} in the url`, () => {
            expect(http.url?.split(fields)[1]).toContain(field);
          })
        );
      });
    }

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
