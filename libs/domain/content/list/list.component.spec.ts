import { fixture } from '@open-wc/testing-helpers';
import { ContentService, contentListComponent } from '@spryker-oryx/content';
import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  LayoutBuilder,
  LayoutService,
  ScreenService,
} from '@spryker-oryx/experience';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ContentListComponent } from './list.component';

const mockContent = [
  {
    _meta: {
      name: 'aName',
      type: 'aType',
    },
    id: 'aId',
    heading: 'aHeading',
  },
  {
    _meta: {
      name: 'bName',
      type: 'bType',
    },
    id: 'bId',
  },
  {
    _meta: {
      name: 'cName',
      type: 'cType',
    },
    id: 'cId',
    heading: 'cHeading',
  },
];

const mockContentService = {
  getAll: vi.fn().mockReturnValue(of(mockContent)),
};

const mockContext = {
  get: vi.fn().mockReturnValue(of({})),
};

const mockLayoutService = {
  getStyles: vi.fn().mockReturnValue(of('')),
  getRender: vi.fn().mockReturnValue(of('')),
  getStylesFromOptions: vi.fn().mockReturnValue(of('')),
};

const mockLayoutBuilder = {
  createStylesFromOptions: vi.fn().mockReturnValue(of('')),
  getActiveLayoutRules: vi.fn().mockReturnValue(of({})),
};

const mockScreenService = {
  getScreenSize: vi.fn(),
};

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

describe('ContentListComponent', () => {
  let element: ContentListComponent;

  beforeAll(async () => {
    await useComponent(contentListComponent);
  });

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: LayoutService,
          useValue: mockLayoutService,
        },
        {
          provide: LayoutBuilder,
          useValue: mockLayoutBuilder,
        },
        {
          provide: ScreenService,
          useValue: mockScreenService,
        },
        {
          provide: ContentService,
          useValue: mockContentService,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when component is created', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-content-list></oryx-content-list>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(ContentListComponent);
    });

    it('should render result of contentService', () => {
      const links = element.renderRoot.querySelectorAll('oryx-content-link');

      links.forEach((link, index) => {
        const data = mockContent[index];
        expect(link).toHaveProperty('options', {
          type: data._meta.type,
          id: data.id,
          url: undefined,
        });
        expect(link).toHaveProperty('content', {
          text: data.heading ?? data._meta.name,
        });
      });
    });
  });

  describe('when context is provided', () => {
    beforeEach(async () => {
      mockContext.get.mockReturnValue(
        of({ type: 'type', query: 'query', tags: 'tags' })
      );
      element = await fixture(html`<oryx-content-list></oryx-content-list>`);
    });

    it('should call contentService with proper params', () => {
      expect(mockContentService.getAll).toHaveBeenCalledWith({
        type: 'type',
        entities: ['type'],
        query: 'query',
        tags: 'tags',
      });
    });
  });

  describe('when props are provided', () => {
    beforeEach(() => {
      mockContext.get.mockReturnValue(
        of({ type: 'type', query: 'query', tags: 'tags' })
      );
    });

    it('should call contentService with proper params', async () => {
      element = await fixture(
        html`<oryx-content-list type="type"></oryx-content-list>`
      );
      expect(mockContentService.getAll).toHaveBeenCalledWith({
        type: 'type',
        entities: ['type'],
      });
    });

    it('should call contentService with proper params', async () => {
      element = await fixture(
        html`<oryx-content-list query="query" tags="tags"></oryx-content-list>`
      );
      expect(mockContentService.getAll).toHaveBeenCalledWith({
        query: 'query',
        tags: 'tags',
      });
    });
  });
});
