import { nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { MessageType, postMessage } from '@spryker-oryx/experience';
import { of } from 'rxjs';
import { SuggestionField } from '../adapter';
import { SuggestionService } from '../suggestion';
import { ProductsExperienceDataRevealer } from './products-experience-data.revealer';

const mockSuggestionService = {
  get: vi.fn().mockReturnValue(of(null)),
};

describe('ProductsExperienceDataRevealer', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: SuggestionService,
          useValue: mockSuggestionService,
        },
        {
          provide: 'service',
          useClass: ProductsExperienceDataRevealer,
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
      mockSuggestionService.get.mockReturnValue(of(mockSuggestions));
      getInjector().inject('service').reveal().subscribe();
      postMessage(
        {
          type: MessageType.Query,
          data: mockQuery,
        },
        window
      );
      await nextFrame();
      expect(mockSuggestionService.get).toHaveBeenCalledWith({
        query: mockQuery,
        entities: [SuggestionField.Products],
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
  });
});
