import { fixture } from '@open-wc/testing-helpers';
import { ContentService, contentListComponent } from '@spryker-oryx/content';
import { EntityService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  LayoutBuilder,
  LayoutService,
  ScreenService,
} from '@spryker-oryx/experience';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
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

const mockEntityService = {
  getField: vi.fn().mockReturnValue(of({})),
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
        {
          provide: EntityService,
          useValue: mockEntityService,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  describe('when component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-list type="test"></oryx-content-list>`
      );
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
    const contextValue = 'contextValue';

    beforeEach(async () => {
      mockEntityService.getField.mockReturnValue(of(contextValue));
      element = await fixture(
        html`<oryx-content-list
          context="context"
          field="sku"
        ></oryx-content-list>`
      );
    });

    it('should call contentService with proper params', () => {
      expect(mockEntityService.getField).toHaveBeenCalledWith({
        type: 'context',
        field: 'sku',
      });
      expect(mockContentService.getAll).toHaveBeenCalledWith({
        tags: contextValue,
      });
    });

    describe('and behavior is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-content-list
            context="context"
            field="sku"
            behavior="type"
          ></oryx-content-list>`
        );
      });

      it('should call contentService with proper params', () => {
        expect(mockContentService.getAll).toHaveBeenCalledWith({
          type: contextValue,
          entities: [contextValue],
        });
      });
    });
  });

  describe('when props are provided', () => {
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
