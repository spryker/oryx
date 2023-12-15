import { ContentService } from '@spryker-oryx/content';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { SuggestionQualifier } from '../../models';
import { ContentSuggestionAdapter } from './content-suggestion.adapter';
import { SuggestionAdapter, SuggestionField } from './suggestion.adapter';

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
        id: '1',
        heading: 'Test Article 1',
        _meta: {
          type: 'article',
        },
      },
      {
        id: '2',
        heading: 'Test Article 2',
        _meta: {
          type: 'article',
        },
      },
    ];
    mockContentService.getAll.mockReturnValue(of(data));
    adapter.get(qualifier).subscribe(callback);
    expect(contentService.getAll).toHaveBeenCalledWith(qualifier);
    expect(callback).toHaveBeenCalledWith({
      [SuggestionField.Contents]: [
        {
          name: data[0].heading,
          id: data[0].id,
          type: data[0]._meta.type,
        },
        {
          name: data[1].heading,
          id: data[1].id,
          type: data[1]._meta.type,
        },
      ],
    });
  });
});
