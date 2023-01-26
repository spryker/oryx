import { nextFrame } from '@open-wc/testing-helpers';
import {
  App,
  AppRef,
  FeatureOptionsService,
  ResourcePlugin,
} from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { DataIds, MessageType } from './data-client.model';
import { ExperienceDataClientService } from './data-client.service';
import { DefaultExperienceDataClientService } from './default-data-client.service';

class MockApp implements Partial<App> {
  findPlugin = vi.fn();
}

class MockFeatureOptionsService implements Partial<FeatureOptionsService> {
  getOptions = vi.fn().mockReturnValue(of(null));
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
  });

  describe('initialize', () => {
    it('should send `MessageType.Graphics` post message', () => {
      const mockResources = {
        graphics: {
          a: {},
          b: {},
          c: {},
        },
      };
      const app = getService<MockApp>(AppRef);
      getService<MockApp>(AppRef).findPlugin.mockReturnValue({
        getResources: () => mockResources,
      });
      getInjector()
        .inject(ExperienceDataClientService)
        .initialize()
        .subscribe();
      expect(app.findPlugin).toHaveBeenCalledWith(ResourcePlugin);
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.Graphics,
          [DataIds.Graphics]: Object.keys(mockResources.graphics),
        },
        '*'
      );
    });

    it('should send `MessageType.Options` post message', () => {
      const mockOptions = {
        global: {
          a: 'a',
        },
        b: {
          b: 'b',
        },
      };
      getService<MockFeatureOptionsService>(
        FeatureOptionsService
      ).getOptions.mockReturnValue(of(mockOptions));
      getInjector()
        .inject(ExperienceDataClientService)
        .initialize()
        .subscribe();
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.Options,
          [DataIds.Options]: mockOptions,
        },
        '*'
      );
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
      window.postMessage(
        {
          type: MessageType.Query,
          [DataIds.Query]: mockQuery,
        },
        '*'
      );
      await nextFrame();
      expect(suggestionService.get).toHaveBeenCalledWith({
        query: mockQuery,
      });
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.Products,
          [DataIds.Products]: mockSuggestions.products.map(({ sku, name }) => ({
            sku,
            name,
          })),
        },
        '*'
      );
    });
  });
});
