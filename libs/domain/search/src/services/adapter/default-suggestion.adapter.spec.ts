import {
  HttpService,
  JsonApiIncludeService,
  JsonAPITransformerService,
} from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { SuggestionQualifier } from '../../models';
import { DefaultSuggestionAdapter } from './default-suggestion.adapter';
import { SuggestionNormalizer } from './normalizers';
import { SuggestionAdapter } from './suggestion.adapter';

const mockApiUrl = 'mockApiUrl';
const mockSuggestion = {
  data: [
    {
      attributes: {
        completion: [],
        categories: [],
        cmsPages: [],
      },
    },
  ],
};
const mockTransformer = {
  transform: vi.fn().mockReturnValue(of(null)),
  do: vi.fn().mockReturnValue(() => of(null)),
};
class MockJsonApiIncludeService implements Partial<JsonApiIncludeService> {
  get() {
    return of('');
  }
}

describe('DefaultSuggestionAdapter', () => {
  let service: SuggestionAdapter;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: SuggestionAdapter,
          useClass: DefaultSuggestionAdapter,
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
          provide: JsonApiIncludeService,
          useClass: MockJsonApiIncludeService,
        },
      ],
    });

    service = testInjector.inject(SuggestionAdapter)[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultSuggestionAdapter);
  });

  describe('get method', () => {
    const mockQualifier: SuggestionQualifier = { query: 'test' };

    beforeEach(() => {
      http.flush(mockSuggestion);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should build correct base url', () => {
      service.get(mockQualifier);

      expect(http.url).toContain(
        `${mockApiUrl}/catalog-search-suggestions?q=${mockQualifier.query}`
      );
    });

    it('should call transformer with proper normalizer', () => {
      service.get(mockQualifier).subscribe();

      expect(mockTransformer.do).toHaveBeenCalledWith(SuggestionNormalizer);
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
      const query = 'test';
      expect(service.getKey({ query })).toBe(query);
    });

    it('should generate empty string when query param is not provided', () => {
      expect(service.getKey({})).toBe('');
    });
  });
});
