import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { Injector } from '@spryker-oryx/injector';
import { SuggestionQualifier } from '../../models';
import { DefaultServiceAdapter } from './default-suggestion.adapter';
import { SuggestionAdapter } from './suggestion.adapter';

const mockApiUrl = 'mockApiUrl';
const mockSuggestion = {
  data: [
    {
      attributes: {
        completion: [],
        categories: [],
        cmsPages: [],
        abstractProducts: [],
      },
    },
  ],
};

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
      const result = service.normalize?.(mockSuggestion);
      expect(result).toEqual(mockSuggestion.data[0].attributes);
    });
  });

  describe('get method', () => {
    const callback = vi.fn();
    const mockQualifier: SuggestionQualifier = { query: 'test' };

    beforeEach(() => {
      http.flush(mockSuggestion);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should build correct base url', () => {
      service.get(mockQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockSuggestion.data[0].attributes);
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
