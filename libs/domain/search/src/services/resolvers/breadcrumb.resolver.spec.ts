import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ProductCategoryService } from '@spryker-oryx/product';
import { LinkService } from '@spryker-oryx/site';
import { of } from 'rxjs';
import { FacetListService } from '../facet-list.service';
import {
  CategoryBreadcrumb,
  CategoryBreadcrumbResolver,
} from './breadcrumb.resolver';

const url = '/mock';

const category = {
  id: 'mock',
  name: 'mock',
  order: 1,
};

const facet = {
  name: 'mock',
  parameter: 'mock',
  selectedValues: ['mock'],
  values: [],
};

class MockLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of(url));
}

class MockFacetListService implements Partial<FacetListService> {
  getFacet = vi.fn().mockReturnValue(of(facet));
}

class MockCategoryService implements Partial<ProductCategoryService> {
  getTrail = vi.fn().mockReturnValue(of([category]));
}

describe('CategoryBreadcrumbResolver', () => {
  let service: CategoryBreadcrumbResolver;
  let linkService: MockLinkService;
  let facetService: MockFacetListService;
  let categoryService: MockCategoryService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        CategoryBreadcrumb,
        {
          provide: LinkService,
          useClass: MockLinkService,
        },
        {
          provide: FacetListService,
          useClass: MockFacetListService,
        },
        {
          provide: ProductCategoryService,
          useClass: MockCategoryService,
        },
      ],
    });

    linkService = testInjector.inject<MockLinkService>(LinkService);
    facetService = testInjector.inject<MockFacetListService>(FacetListService);
    categoryService = testInjector.inject<MockCategoryService>(ProductCategoryService);
    service = testInjector.inject(CategoryBreadcrumb.provide);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('resolve', () => {
    describe('when the parent category is selected', () => {
      const callback = vi.fn();

      beforeEach(() => {
        service.resolve().subscribe(callback);
      });

      it('should get the categories facets', () => {
        expect(facetService.getFacet).toHaveBeenCalledWith({
          parameter: 'category',
        });
      });

      it('should build categories trail', () => {
        expect(categoryService.getTrail).toHaveBeenCalledWith(facet.selectedValues[0]);
      });

      it('should get the url form the service', () => {
        expect(linkService.get).toHaveBeenCalledWith(
          expect.objectContaining({ id: category.id })
        );
      });

      it('should resolve single breadcrumb', () => {
        expect(callback).toHaveBeenCalledWith([
          { text: { raw: category.name }, url },
        ]);
      });
    });
  });
});
