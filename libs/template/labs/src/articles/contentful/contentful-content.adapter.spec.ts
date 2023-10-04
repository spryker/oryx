import { ContentAdapter } from '@spryker-oryx/content';
import { HttpService, TransformerService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { of } from 'rxjs';
import { DefaultContentfulContentAdapter } from './contentful-content.adapter';
import { ContentfulSpace, ContentfulToken } from './contentful.model';
import { ContentfulFieldNormalizer } from './normalizers';

const mockLocaleService = {
  get: vi.fn(),
  getAll: vi.fn(),
};

const mockTransformerService = {
  transform: vi.fn(),
};

const mockHttpService = {
  get: vi.fn(),
};

const mockToken = 'mockToken';
const mockSpace = 'mockSpace';

const mockEntries = {
  items: [
    {
      fields: {
        content: 'content-a',
        id: 'id-a',
      },
      sys: {
        id: 'internal-id-a',
        contentType: {
          sys: {
            id: 'a-type',
          },
        },
      },
    },
    {
      fields: {
        content: 'content-b',
        id: 'id-b',
      },
      sys: {
        id: 'internal-id-b',
        contentType: {
          sys: {
            id: 'b-type',
          },
        },
      },
    },
  ],
};

const mockContentTypes = {
  items: [
    {
      fields: [
        {
          id: 'id',
          type: 'idTextA',
        },
        {
          id: 'content',
          type: 'contentTextA',
        },
      ],
      name: 'a-type',
    },
    {
      fields: [
        {
          id: 'id',
          type: 'idTextB',
        },
        {
          id: 'content',
          type: 'contentTextB',
        },
      ],
      name: 'b-type',
    },
  ],
};

const url = `https://cdn.contentful.com/spaces/${mockSpace}`;

const mockLocales = [
  { code: 'en', name: 'en_EN' },
  { code: 'de', name: 'de_DE' },
];

describe('DefaultContentfulContentAdapter', () => {
  let adapter: ContentAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        { provide: ContentfulToken, useValue: mockToken },
        { provide: ContentfulSpace, useValue: mockSpace },
        { provide: LocaleService, useValue: mockLocaleService },
        { provide: TransformerService, useValue: mockTransformerService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ContentAdapter, useClass: DefaultContentfulContentAdapter },
      ],
    });

    adapter = testInjector.inject(ContentAdapter)[0];

    mockLocaleService.get.mockReturnValue(of(mockLocales[0].code));
    mockLocaleService.getAll.mockReturnValue(of(mockLocales));
    mockHttpService.get.mockImplementation((url) => {
      if (url.includes('/entries')) return of(mockEntries);
      if (url.includes('/content_types')) return of(mockContentTypes);
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
      const qualifier = { type: 'type', entities: ['a'] };

      adapter.getAll(qualifier).subscribe(callback);

      expect(mockHttpService.get).toHaveBeenNthCalledWith(
        1,
        `${url}/entries?content_type=${
          qualifier.type
        }&locale=${mockLocales[0].name.replace('_', '-')}`,
        {
          headers: { Authorization: `Bearer ${mockToken}` },
        }
      );
      expect(mockHttpService.get).toHaveBeenNthCalledWith(
        2,
        `${url}/content_types?name=${mockEntries.items[0].sys.contentType.sys.id}`,
        {
          headers: { Authorization: `Bearer ${mockToken}` },
        }
      );
      expect(mockHttpService.get).toHaveBeenNthCalledWith(
        3,
        `${url}/content_types?name=${mockEntries.items[1].sys.contentType.sys.id}`,
        {
          headers: { Authorization: `Bearer ${mockToken}` },
        }
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        1,
        {
          key: 'content',
          value: mockEntries.items[0].fields.content,
          type: mockContentTypes.items[0].fields[1].type,
        },
        ContentfulFieldNormalizer
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        2,
        {
          key: 'id',
          value: mockEntries.items[0].fields.id,
          type: mockContentTypes.items[0].fields[0].type,
        },
        ContentfulFieldNormalizer
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        3,
        {
          key: 'content',
          value: mockEntries.items[1].fields.content,
          type: mockContentTypes.items[0].fields[1].type,
        },
        ContentfulFieldNormalizer
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        4,
        {
          key: 'id',
          value: mockEntries.items[1].fields.id,
          type: mockContentTypes.items[0].fields[0].type,
        },
        ContentfulFieldNormalizer
      );
      expect(callback).toHaveBeenCalledWith([
        {
          fields: mockEntries.items[0].fields,
          id: mockEntries.items[0].sys.id,
          type: qualifier.type,
          name: mockEntries.items[0].fields.id,
        },
        {
          fields: mockEntries.items[1].fields,
          id: mockEntries.items[1].sys.id,
          type: qualifier.type,
          name: mockEntries.items[1].fields.id,
        },
      ]);
    });
  });

  describe('get', () => {
    it('should return Content object matched by id', () => {
      const callback = vi.fn();
      const qualifier = {
        id: mockEntries.items[1].fields.id,
        type: 'type',
        entities: ['a'],
      };

      adapter.get(qualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith({
        fields: mockEntries.items[1].fields,
        id: mockEntries.items[1].sys.id,
        type: qualifier.type,
        name: mockEntries.items[1].fields.id,
      });
    });
  });
});
