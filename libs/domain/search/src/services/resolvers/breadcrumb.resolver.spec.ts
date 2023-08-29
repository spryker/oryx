import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Facet } from '@spryker-oryx/product';
import { LinkService } from '@spryker-oryx/site';
import { of } from 'rxjs';
import { FacetListService } from '../facet-list.service';
import {
  CategoryBreadcrumb,
  CategoryBreadcrumbResolver,
} from './breadcrumb.resolver';

const url = '/mock';

const parent = {
  count: 1,
  value: 5,
  selected: false,
  name: 'mock_parent',
};

const child = {
  count: 1,
  value: 6,
  selected: false,
  name: 'mock_child',
};

const facet: Facet = {
  name: 'mock',
  parameter: 'mock',
  values: [
    {
      ...parent,
      selected: true,
      children: [child],
    },
  ],
};

const facetSelectedChild: Facet = {
  name: 'mock',
  parameter: 'mock',
  values: [
    {
      ...parent,
      children: [{ ...child, selected: true }],
    },
  ],
};

const facetWithoutSelected: Facet = {
  name: 'mock',
  parameter: 'mock',
  values: [
    {
      ...parent,
      children: [child],
    },
  ],
};

class MockLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of(url));
}

class MockFacetListService implements Partial<FacetListService> {
  getFacet = vi.fn().mockReturnValue(of(facet));
}

describe('CategoryBreadcrumbResolver', () => {
  let service: CategoryBreadcrumbResolver;
  let linkService: MockLinkService;
  let facetService: MockFacetListService;

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
      ],
    });

    linkService = testInjector.inject<MockLinkService>(LinkService);
    facetService = testInjector.inject<MockFacetListService>(FacetListService);
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

      it('should get the url form the service', () => {
        expect(linkService.get).toHaveBeenCalledWith(
          expect.objectContaining({ id: String(parent.value) })
        );
      });

      it('should resolve single breadcrumb', () => {
        expect(callback).toHaveBeenCalledWith([{ text: parent.name, url }]);
      });
    });

    describe('when the nested category is selected', () => {
      const callback = vi.fn();

      beforeEach(() => {
        facetService.getFacet = vi.fn().mockReturnValue(of(facetSelectedChild));
        linkService.get = vi.fn().mockReturnValue(of(url));
        service.resolve().subscribe(callback);
      });

      it('should get the urls form the service', () => {
        expect(linkService.get).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({ id: String(parent.value) })
        );
        expect(linkService.get).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({ id: String(child.value) })
        );
      });

      it('should resolve a trace of breadcrumb', () => {
        expect(callback).toHaveBeenCalledWith([
          { text: parent.name, url },
          { text: child.name, url },
        ]);
      });
    });

    describe('when there are no selected facets', () => {
      const callback = vi.fn();

      beforeEach(() => {
        facetService.getFacet = vi
          .fn()
          .mockReturnValue(of(facetWithoutSelected));
        service.resolve().subscribe({ error: callback });
      });

      it('should throw an error', () => {
        expect(callback).toHaveBeenCalled();
      });
    });
  });
});
