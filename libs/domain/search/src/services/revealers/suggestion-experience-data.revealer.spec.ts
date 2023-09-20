import { nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { MessageType, postMessage } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { of } from 'rxjs';
import { SuggestionField } from '../adapter';
import { SuggestionService } from '../suggestion';
import { SuggestionExperienceDataRevealer } from './suggestion-experience-data.revealer';

const mockSuggestionService = {
  get: vi.fn().mockReturnValue(of(null)),
};

describe('SuggestionExperienceDataRevealer', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: SuggestionService,
          useValue: mockSuggestionService,
        },
        {
          provide: 'service',
          useClass: SuggestionExperienceDataRevealer,
        },
      ],
    });
    vi.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('reveal', () => {
    it('should send `MessageType.SuggestionQuery` post message', async () => {
      const mockQuery = 'mockQuery';
      const mockSuggestions = {
        products: [
          {
            a: 'a',
            sku: 'skuA',
            name: 'nameA',
            type: RouteType.Product,
          },
          {
            b: 'b',
            sku: 'skuB',
            name: 'nameB',
            type: RouteType.Product,
          },
        ],
        suggestion: ['a', 'b'],
      };
      mockSuggestionService.get.mockReturnValue(of(mockSuggestions));
      getInjector().inject('service').reveal().subscribe();
      const mockData = {
        query: mockQuery,
        entities: [SuggestionField.Products],
      };
      postMessage(
        {
          type: MessageType.SuggestionQuery,
          data: mockData,
        },
        window
      );
      await nextFrame();
      expect(mockSuggestionService.get).toHaveBeenCalledWith(mockData);
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.Suggestions,
          data: mockSuggestions,
        },
        '*'
      );
    });
  });
});
