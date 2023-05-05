import { nextFrame } from '@open-wc/testing-helpers';
import {
  App,
  AppRef,
  ComponentsPlugin,
  FeatureOptionsService,
} from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { optionsKey } from '../../../decorators';
import { ResourcePlugin } from '../../../plugins';
import { postMessage } from '../utilities';
import { MessageType } from './data-client.model';
import { ExperienceDataClientService } from './data-client.service';
import { DefaultExperienceDataClientService } from './default-data-client.service';

const mockAppFn = {
  getResources: vi.fn(),
  getComponentClass: vi.fn(),
  getComponentSchemas: vi.fn().mockReturnValue(of([])),
};

class MockApp implements Partial<App> {
  requirePlugin = vi.fn().mockReturnValue(mockAppFn);
  whenReady = vi.fn().mockReturnValue(of(null));
}

class MockFeatureOptionsService implements Partial<FeatureOptionsService> {
  getFeatureOptions = vi.fn().mockReturnValue(null);
}

class MockSuggestionService {
  get = vi.fn().mockReturnValue(of(null));
}

const getService = <T>(token: string) =>
  getInjector().inject(token) as unknown as T;

describe('ExperienceDataClientService', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: ExperienceDataClientService,
          useClass: DefaultExperienceDataClientService,
        },
        {
          provide: AppRef,
          useClass: MockApp,
        },
        {
          provide: FeatureOptionsService,
          useClass: MockFeatureOptionsService,
        },
        {
          provide: 'oryx.SuggestionService',
          useClass: MockSuggestionService,
        },
      ],
    });
    vi.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('initialize', () => {
    it('should send `MessageType.Graphics` post message', async () => {
      const mockResources = {
        graphics: {
          a: {},
          b: {},
          c: {},
        },
      };
      const app = getService<MockApp>(AppRef);
      mockAppFn.getResources.mockReturnValue(mockResources);
      getInjector()
        .inject(ExperienceDataClientService)
        .initialize()
        .subscribe();
      await nextFrame();
      expect(app.requirePlugin).toHaveBeenCalledWith(ResourcePlugin);
      expect(mockAppFn.getResources).toHaveBeenCalled();
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.Graphics,
          data: Object.keys(mockResources.graphics),
        },
        '*'
      );
    });

    it('should send `MessageType.Options` post message', async () => {
      const mockDefaultOptions = {
        b: 'b',
      };
      const mockFeatureOptions = {
        c: 'c',
      };
      const mockComponentType = 'mockComponentType';
      const app = getService<MockApp>(AppRef);
      mockAppFn.getComponentClass.mockReturnValue({
        [optionsKey]: mockDefaultOptions,
      });
      getService<MockFeatureOptionsService>(
        FeatureOptionsService
      ).getFeatureOptions.mockReturnValue(mockFeatureOptions);
      getInjector()
        .inject(ExperienceDataClientService)
        .initialize()
        .subscribe();
      postMessage(
        {
          type: MessageType.ComponentType,
          data: mockComponentType,
        },
        window
      );
      await nextFrame();
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.Options,
          data: {
            ...mockDefaultOptions,
            ...mockFeatureOptions,
          },
        },
        '*'
      );
      expect(mockAppFn.getComponentClass).toHaveBeenCalledWith(
        mockComponentType
      );
      expect(app.requirePlugin).toHaveBeenCalledWith(ComponentsPlugin);
    });

    it('should send `MessageType.Products` post message', async () => {
      const mockQuery = 'mockQuery';
      const mockSuggestions = {
        products: [
          {
            a: 'a',
            sku: 'skuA',
            name: 'nameA',
          },
          {
            b: 'b',
            sku: 'skuB',
            name: 'nameB',
          },
        ],
      };
      const suggestionService = getService<MockSuggestionService>(
        'oryx.SuggestionService'
      );
      suggestionService.get.mockReturnValue(of(mockSuggestions));
      getInjector()
        .inject(ExperienceDataClientService)
        .initialize()
        .subscribe();
      postMessage(
        {
          type: MessageType.Query,
          data: mockQuery,
        },
        window
      );
      await nextFrame();
      expect(suggestionService.get).toHaveBeenCalledWith({
        query: mockQuery,
      });
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.Products,
          data: mockSuggestions.products.map(({ sku, name }) => ({
            sku,
            name,
          })),
        },
        '*'
      );
    });

    it('should send `MessageType.ComponentSchemas` post message', async () => {
      const mockSchemaA = { b: 'b' };
      const mockSchemaB = { b: 'b' };
      const app = getService<MockApp>(AppRef);
      mockAppFn.getComponentSchemas.mockReturnValue(
        of([mockSchemaA, mockSchemaB])
      );
      getInjector()
        .inject(ExperienceDataClientService)
        .initialize()
        .subscribe();
      await nextFrame();
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.ComponentSchemas,
          data: [mockSchemaA, mockSchemaB],
        },
        '*'
      );
      expect(mockAppFn.getComponentSchemas).toHaveBeenCalled();
      expect(app.requirePlugin).toHaveBeenCalledWith(ComponentsPlugin);
    });
  });
});
