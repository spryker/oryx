import { HttpService, TransformerService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { of } from 'rxjs';
import { ContentAdapter } from '../../adapter';
import { StrapiFieldNormalizer } from './normalizers';
import { DefaultStrapiContentAdapter } from './strapi-content.adapter';
import { StrapiApiUrl, StrapiToken } from './strapi.model';

const mockLocaleService = {
  get: vi.fn(),
};

const mockTransformerService = {
  transform: vi.fn(),
};

const mockHttpService = {
  get: vi.fn(),
};

const mockToken = 'mockToken';
const mockApiUrl = 'mockApiUrl';

const mockData = {
  data: [
    {
      attributes: {
        content: 'content-a',
        identifier: 'id-a',
      },
      id: 'internal-id-a',
    },
    {
      attributes: {
        content: 'content-b',
        identifier: 'id-b',
      },
      id: 'internal-id-b',
    },
  ],
};

const mockType = 'mockType';

const mockContentTypes = {
  data: [
    {
      schema: {
        singularName: mockType,
        pluralName: `${mockType}s`,
        attributes: {
          content: { type: 'atext' },
          identifier: { type: 'btext' },
        },
      },
    },
  ],
};

const mockLocale = 'en';

describe('DefaultStoryblokContentAdapter', () => {
  let adapter: ContentAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        { provide: StrapiToken, useValue: mockToken },
        { provide: StrapiApiUrl, useValue: mockApiUrl },
        { provide: LocaleService, useValue: mockLocaleService },
        { provide: TransformerService, useValue: mockTransformerService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ContentAdapter, useClass: DefaultStrapiContentAdapter },
      ],
    });

    adapter = testInjector.inject(ContentAdapter)[0];

    mockLocaleService.get.mockReturnValue(of(mockLocale));
    mockHttpService.get.mockImplementation((reqUrl) => {
      if (reqUrl.includes('/mockType')) {
        return of(mockData);
      }

      if (reqUrl.includes('content-type-builder/content-types')) {
        return of(mockContentTypes);
      }

      return of(null);
    });
    mockTransformerService.transform.mockImplementation((data) => of(data));
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  describe('getAll', () => {
    it('should return array of Content objects', () => {
      const callback = vi.fn();
      const qualifier = { type: mockType, entities: ['a'] };

      adapter.getAll(qualifier).subscribe(callback);

      expect(mockHttpService.get).toHaveBeenNthCalledWith(
        1,
        `${mockApiUrl}/api/content-type-builder/content-types`,
        {
          headers: { Authorization: `Bearer ${mockToken}` },
        }
      );
      expect(mockHttpService.get).toHaveBeenNthCalledWith(
        2,
        `${mockApiUrl}/api/${mockContentTypes.data[0].schema.pluralName}?&locale=${mockLocale}`,
        {
          headers: { Authorization: `Bearer ${mockToken}` },
        }
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        1,
        {
          key: 'content',
          value: mockData.data[0].attributes.content,
          type: mockContentTypes.data[0].schema.attributes.content.type,
        },
        StrapiFieldNormalizer
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        2,
        {
          key: 'identifier',
          value: mockData.data[0].attributes.identifier,
          type: mockContentTypes.data[0].schema.attributes.identifier.type,
        },
        StrapiFieldNormalizer
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        3,
        {
          key: 'content',
          value: mockData.data[1].attributes.content,
          type: mockContentTypes.data[0].schema.attributes.content.type,
        },
        StrapiFieldNormalizer
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        4,
        {
          key: 'identifier',
          value: mockData.data[1].attributes.identifier,
          type: mockContentTypes.data[0].schema.attributes.identifier.type,
        },
        StrapiFieldNormalizer
      );
      expect(callback).toHaveBeenCalledWith([
        {
          id: mockData.data[0].attributes.identifier,
          content: mockData.data[0].attributes.content,
          _meta: {
            id: mockData.data[0].id,
            type: qualifier.type,
          },
        },
        {
          id: mockData.data[1].attributes.identifier,
          content: mockData.data[1].attributes.content,
          _meta: {
            id: mockData.data[1].id,
            type: qualifier.type,
          },
        },
      ]);
    });
  });

  describe('get', () => {
    it('should return Content object matched by id', () => {
      const callback = vi.fn();
      const qualifier = {
        id: mockData.data[0].attributes.identifier,
        type: mockType,
        entities: ['a'],
      };

      adapter.get(qualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith({
        id: mockData.data[0].attributes.identifier,
        content: mockData.data[0].attributes.content,
        _meta: {
          id: mockData.data[0].id,
          type: qualifier.type,
        },
      });
    });
  });
});
