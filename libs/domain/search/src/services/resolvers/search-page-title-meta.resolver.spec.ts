import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { of } from 'rxjs';
import { SearchPageTitleMetaResolver } from './search-page-title-meta.resolver';

const mockRouter = {
  currentQuery: vi.fn(),
};

describe('DefaultSuggestionService', () => {
  let service: SearchPageTitleMetaResolver;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: SearchPageTitleMetaResolver,
          useClass: SearchPageTitleMetaResolver,
        },
        {
          provide: RouterService,
          useValue: mockRouter,
        },
      ],
    });

    service = testInjector.inject(SearchPageTitleMetaResolver);
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  describe('getScore', () => {
    it('should return proper value if category exist', () => {
      const callback = vi.fn();
      mockRouter.currentQuery.mockReturnValue(of({ q: 'a' }));
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(['a']);
    });

    it('should return proper value if category is not exist', () => {
      const callback = vi.fn();
      mockRouter.currentQuery.mockReturnValue(of({}));
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([undefined]);
    });
  });

  describe('resolve', () => {
    it('should return proper object with category title', () => {
      const callback = vi.fn();
      mockRouter.currentQuery.mockReturnValue(of({ q: 'category' }));
      service.resolve().subscribe(callback);
      expect(callback).toHaveBeenCalledWith({
        title: 'category',
      });
    });
  });
});
