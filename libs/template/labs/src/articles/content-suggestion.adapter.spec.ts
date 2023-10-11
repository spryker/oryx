import { ContentService } from '@spryker-oryx/content';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { of } from 'rxjs';
import { ContentSuggestionAdapter } from './content-suggestion.adapter';

const mockContentService = {
  getAll: vi.fn(),
};

describe('ContentSuggestionAdapter', () => {
  let adapter: SuggestionAdapter;
  let contentService: ContentService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        { provide: ContentService, useValue: mockContentService },
        { provide: SuggestionAdapter, useClass: ContentSuggestionAdapter },
      ],
    });

    contentService = testInjector.inject(ContentService);
    adapter = testInjector.inject(SuggestionAdapter)[0];
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  it('should return suggestions based on the provided qualifier', () => {
    const callback = vi.fn();
    const qualifier: SuggestionQualifier = {
      query: 'test',
      entities: ['article'],
    };

    const data = [
      {
        fields: {
          id: '1',
          heading: 'Test Article 1',
        },
        type: 'article',
      },
      {
        fields: {
          id: '2',
          heading: 'Test Article 2',
        },
        type: 'article',
      },
    ];
    mockContentService.getAll.mockReturnValue(of(data));
    adapter.get(qualifier).subscribe(callback);
    expect(contentService.getAll).toHaveBeenCalledWith(qualifier);
    expect(callback).toHaveBeenCalledWith({
      [SuggestionField.Contents]: [
        {
          name: data[0].fields.heading,
          id: data[0].fields.id,
          type: data[0].type,
        },
        {
          name: data[1].fields.heading,
          id: data[1].fields.id,
          type: data[1].type,
        },
      ],
    });
  });
});
