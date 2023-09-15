import { nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { MessageType, postMessage } from '@spryker-oryx/experience';
import { of } from 'rxjs';
import { SuggestionField } from '../adapter';
import { SuggestionService } from '../suggestion';
import { CategoriesExperienceDataRevealer } from './categories-experience-data.revealer';

const mockSuggestionService = {
  get: vi.fn().mockReturnValue(of(null)),
};

describe('CategoriesExperienceDataRevealer', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: SuggestionService,
          useValue: mockSuggestionService,
        },
        {
          provide: 'service',
          useClass: CategoriesExperienceDataRevealer,
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
    it('should send `MessageType.Categories` post message', async () => {
      const mockQuery = 'mockQuery';
      const mockSuggestions = {
        categories: [
          {
            a: 'a',
            id: 'idA',
            name: 'nameA',
          },
          {
            b: 'b',
            id: 'idB',
            name: 'nameB',
          },
        ],
      };
      mockSuggestionService.get.mockReturnValue(of(mockSuggestions));
      getInjector().inject('service').reveal().subscribe();
      postMessage(
        {
          type: MessageType.Category,
          data: mockQuery,
        },
        window
      );
      await nextFrame();
      expect(mockSuggestionService.get).toHaveBeenCalledWith({
        query: mockQuery,
        entities: [SuggestionField.Categories],
      });
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.Categories,
          data: mockSuggestions.categories.map(({ id, name }) => ({
            id,
            name,
          })),
        },
        '*'
      );
    });
  });
});
