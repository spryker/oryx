import { ResolverScore } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { of } from 'rxjs';
import { FacetListService } from '../facet-list.service';
import { CategoryPageTitleMetaResolver } from './category-page-title-meta.resolver';

const mockRouter = {
  currentQuery: vi.fn(),
};

const mockFacets = {
  get: vi.fn(),
};

describe('DefaultSuggestionService', () => {
  let service: CategoryPageTitleMetaResolver;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CategoryPageTitleMetaResolver,
          useClass: CategoryPageTitleMetaResolver,
        },
        {
          provide: RouterService,
          useValue: mockRouter,
        },
        {
          provide: FacetListService,
          useValue: mockFacets,
        },
      ],
    });

    service = testInjector.inject(CategoryPageTitleMetaResolver);
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  describe('getScore', () => {
    it('should return proper value if category exist', () => {
      const callback = vi.fn();
      mockRouter.currentQuery.mockReturnValue(of({ category: 4 }));
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(ResolverScore.OverrideDefault);
    });

    it('should return proper value if category is not exist', () => {
      const callback = vi.fn();
      mockRouter.currentQuery.mockReturnValue(of({ item: 'category' }));
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(ResolverScore.NotUsed);
    });
  });

  describe('resolve', () => {
    it('should return proper object with category title', () => {
      const callback = vi.fn();
      mockRouter.currentQuery.mockReturnValue(of({ category: 4 }));
      mockFacets.get.mockReturnValue(
        of([
          {
            parameter: 'category',
            values: [
              { value: 1 },
              { value: 2, children: [{ value: 4, name: 'NAME' }] },
            ],
          },
        ])
      );
      service.resolve().subscribe(callback);
      expect(callback).toHaveBeenCalledWith({
        title: 'NAME',
      });
    });

    it('should return fallback object with category title', () => {
      const callback = vi.fn();
      mockRouter.currentQuery.mockReturnValue(of({ category: 4 }));
      mockFacets.get.mockReturnValue(
        of([
          {
            parameter: 'category',
            values: [{ value: 1 }, { value: 2, children: [{ value: 3 }] }],
          },
        ])
      );
      service.resolve().subscribe(callback);
      expect(callback).toHaveBeenCalledWith({
        title: 'Category page',
      });
    });
  });
});
