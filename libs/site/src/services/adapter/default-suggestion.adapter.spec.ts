import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { Injector } from '@spryker-oryx/injector';
import { SuggestionQualifier } from '../../models';
import { DefaultServiceAdapter } from './default-suggestion.adapter';
import { SuggestionAdapter } from './suggestion.adapter';

const concrete = {
  type: 'concrete-products',
  id: '111_111',
  attributes: {
    sku: '111_111',
    name: 'test',
    description: 'test',
  },
  relationships: {
    'concrete-product-image-sets': {
      data: [
        {
          type: 'concrete-product-image-sets',
          id: '111_111',
        },
      ],
    },
    'concrete-product-prices': {
      data: [
        {
          type: 'concrete-product-prices',
          id: '111_111',
        },
      ],
    },
    'abstract-products': {
      data: [
        {
          type: 'abstract-products',
          id: '111',
        },
      ],
    },
  },
};

const abstract = {
  type: 'abstract-products',
  id: '111',
  relationships: {
    'concrete-products': {
      data: [
        {
          type: 'concrete-products',
          id: '111_111',
        },
      ],
    },
  },
};

const complete_included = [
  abstract,
  concrete,
  {
    type: 'concrete-product-image-sets',
    id: '111_111',
    attributes: {
      imageSets: [
        {
          images: [
            {
              externalUrlLarge: '',
              externalUrlSmall: '',
            },
          ],
        },
      ],
    },
  },
  {
    type: 'concrete-product-prices',
    id: '111_111',
    attributes: {
      price: 0,
      prices: [
        {
          priceTypeName: 'DEFAULT',
          grossAmount: 10,
          currency: {
            code: 'EUR',
          },
        },
      ],
    },
  },
];

const partial_included = [abstract, concrete];

const abstract_only_included = [abstract];

const mockApiUrl = 'mockApiUrl';
const mockSuggestion = (included: any[] = []): any => ({
  data: [
    {
      attributes: {
        completion: [],
        categories: [],
        cmsPages: [],
      },
    },
  ],
  included,
});

describe('DefaultSuggestionService', () => {
  let service: SuggestionAdapter;
  let http: HttpTestService;
  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
      {
        provide: HttpService,
        useClass: HttpTestService,
      },
      {
        provide: SuggestionAdapter,
        useClass: DefaultServiceAdapter,
      },
      {
        provide: 'SCOS_BASE_URL',
        useValue: mockApiUrl,
      },
    ]);

    service = testInjector.inject(SuggestionAdapter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultServiceAdapter);
  });

  describe('normalize method', () => {
    it('should return attributes from JSON_API_MODEL', () => {
      const result = service.normalize?.(mockSuggestion());
      expect(result).toEqual({
        ...mockSuggestion().data[0].attributes,
        products: [],
      });
    });

    it('should return empty array when no concrete products in response', () => {
      const result = service.normalize?.(
        mockSuggestion(abstract_only_included)
      );
      expect(result?.products?.length).toBe(0);
    });

    it('should not add relations to concrete product when they are not provided', () => {
      const result = service.normalize?.(mockSuggestion(partial_included));
      expect(result?.products?.[0]).toBeDefined();
      expect(result?.products?.[0].images).not.toBeDefined();
      expect(result?.products?.[0].price?.defaultPrice).not.toBeDefined();
    });

    it('should combine all concrete products relations', () => {
      const result = service.normalize?.(mockSuggestion(complete_included));

      expect(result?.products?.[0]).toBeDefined();
      expect(result?.products?.[0].images).toBeDefined();
      expect(result?.products?.[0].price?.defaultPrice).toBeDefined();
    });
  });

  describe('get method', () => {
    const callback = vi.fn();
    const mockQualifier: SuggestionQualifier = { query: 'test' };

    beforeEach(() => {
      http.flush(mockSuggestion());
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should build correct base url', () => {
      service.get(mockQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith({
        ...mockSuggestion().data[0].attributes,
        products: [],
      });
      expect(http.url).toContain(
        `${mockApiUrl}/catalog-search-suggestions?q=${mockQualifier.query}`
      );
    });
  });

  describe('getKey method', () => {
    it('should generate key from query string', () => {
      const query = 'test';
      expect(service.getKey({ query })).toBe(query);
    });

    it('should generate empty string when query param is not provided', () => {
      expect(service.getKey({})).toBe('');
    });
  });
});
