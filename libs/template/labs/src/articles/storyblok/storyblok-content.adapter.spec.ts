import { ContentAdapter } from '@spryker-oryx/content';
import { HttpService, TransformerService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { of } from 'rxjs';
import { StoryblokFieldNormalizer } from './normalizers';
import { DefaultStoryblokContentAdapter } from './storyblok-content.adapter';
import { StoryblokSpace, StoryblokToken } from './storyblok.model';

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
const mockSpace = 'mockSpace';

const mockStories = {
  stories: [
    {
      content: {
        content: 'content-a',
        id: 'id-a',
        component: 'a-type',
      },
      name: 'name-a',
      id: 'internal-id-a',
    },
    {
      content: {
        content: 'content-b',
        id: 'id-b',
        component: 'b-type',
      },
      name: 'name-b',
      id: 'internal-id-b',
    },
  ],
};

const mockAComponent = {
  component: {
    schema: {
      id: {
        type: 'idTextA',
      },
      content: {
        type: 'contentTextA',
      },
    },
  },
};

const mockBComponent = {
  component: {
    schema: {
      id: {
        type: 'idTextB',
      },
      content: {
        type: 'contentTextB',
      },
    },
  },
};

const mockSpaceData = {
  space: {
    first_token: 'first_token',
    languages: [{ code: 'en', name: 'English' }],
  },
};

const url = `https://mapi.storyblok.com/v1/spaces/${mockSpace}`;
const readonlyUrl = `https://api.storyblok.com/v2/cdn/stories/`;

const mockLocale = 'en';

describe('DefaultStoryblokContentAdapter', () => {
  let adapter: ContentAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        { provide: StoryblokToken, useValue: mockToken },
        { provide: StoryblokSpace, useValue: mockSpace },
        { provide: LocaleService, useValue: mockLocaleService },
        { provide: TransformerService, useValue: mockTransformerService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ContentAdapter, useClass: DefaultStoryblokContentAdapter },
      ],
    });

    adapter = testInjector.inject(ContentAdapter)[0];

    mockLocaleService.get.mockReturnValue(of(mockLocale));
    mockHttpService.get.mockImplementation((reqUrl) => {
      if (reqUrl === url) return of(mockSpaceData);

      if (
        reqUrl.includes(`stories/${mockStories.stories[0].content.component}`)
      )
        return of({ story: mockStories.stories[0] });

      if (reqUrl.includes('&by_slugs')) return of(mockStories);

      if (
        reqUrl.includes(
          `${url}/components/${mockStories.stories[0].content.component}`
        )
      )
        return of(mockAComponent);

      if (
        reqUrl.includes(
          `${url}/components/${mockStories.stories[1].content.component}`
        )
      )
        return of(mockBComponent);

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

      expect(mockHttpService.get).toHaveBeenNthCalledWith(1, url, {
        headers: { Authorization: mockToken },
      });
      expect(mockHttpService.get).toHaveBeenNthCalledWith(
        2,
        `${readonlyUrl}?&by_slugs=${qualifier.type}/*&version=draft&token=${mockSpaceData.space.first_token}&language=${mockLocale}`
      );
      expect(mockHttpService.get).toHaveBeenNthCalledWith(
        3,
        `${url}/components/${mockStories.stories[0].content.component}`,
        { headers: { Authorization: mockToken } }
      );
      expect(mockHttpService.get).toHaveBeenNthCalledWith(
        4,
        `${url}/components/${mockStories.stories[1].content.component}`,
        { headers: { Authorization: mockToken } }
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        1,
        {
          key: 'id',
          value: mockStories.stories[0].content.id,
          type: mockAComponent.component.schema.id.type,
        },
        StoryblokFieldNormalizer
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        2,
        {
          key: 'content',
          value: mockStories.stories[0].content.content,
          type: mockAComponent.component.schema.content.type,
        },
        StoryblokFieldNormalizer
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        3,
        {
          key: 'id',
          value: mockStories.stories[1].content.id,
          type: mockBComponent.component.schema.id.type,
        },
        StoryblokFieldNormalizer
      );
      expect(mockTransformerService.transform).toHaveBeenNthCalledWith(
        4,
        {
          key: 'content',
          value: mockStories.stories[1].content.content,
          type: mockBComponent.component.schema.content.type,
        },
        StoryblokFieldNormalizer
      );
      expect(callback).toHaveBeenCalledWith([
        {
          fields: {
            id: mockStories.stories[0].content.id,
            content: mockStories.stories[0].content.content,
          },
          id: mockStories.stories[0].id,
          type: mockStories.stories[0].content.component,
          name: mockStories.stories[0].name,
        },
        {
          fields: {
            id: mockStories.stories[1].content.id,
            content: mockStories.stories[1].content.content,
          },
          id: mockStories.stories[1].id,
          type: mockStories.stories[1].content.component,
          name: mockStories.stories[1].name,
        },
      ]);
    });
  });

  describe('get', () => {
    it('should return Content object matched by id', () => {
      const callback = vi.fn();
      const qualifier = {
        id: mockStories.stories[0].id,
        type: mockStories.stories[0].content.component,
        entities: ['a'],
      };

      adapter.get(qualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith({
        fields: {
          id: mockStories.stories[0].content.id,
          content: mockStories.stories[0].content.content,
        },
        id: mockStories.stories[0].id,
        type: mockStories.stories[0].content.component,
        name: mockStories.stories[0].name,
      });
    });
  });
});
