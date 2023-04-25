import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { of } from 'rxjs';
import { FacetListService } from '../facet-list.service';
import { CategoryPageTitleMetaResolver } from './category-page-title-meta.resolver';

const mockRouter = {
  currentQuery: vi.fn(),
  currentRoute: vi.fn(),
  getPathId: vi.fn(),
};

const mockFacets = {
  get: vi.fn(),
};

describe('CategoryPageTitleMetaResolver', () => {
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
      mockRouter.getPathId.mockReturnValue(true);
      mockRouter.currentRoute.mockReturnValue(of('/category/'));
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([true, true]);
    });

    it('should return proper value if category is not exist', () => {
      const callback = vi.fn();
      mockRouter.currentQuery.mockReturnValue(of({ category: 4 }));
      mockRouter.getPathId.mockReturnValue(false);
      mockRouter.currentRoute.mockReturnValue(of('/category/'));
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([true, false]);
    });
  });

  describe('resolve', () => {
    it('should return proper object with category title', () => {
      const callback = vi.fn();
      mockRouter.currentQuery.mockReturnValue(of({ category: 4 }));
      mockRouter.getPathId.mockReturnValue(4);
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
  });
});
