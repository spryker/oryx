import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  ProductListPageService,
  ProductListService,
} from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import { DefaultFacetListService } from './default-facet-list.service';
import { FacetListService } from './facet-list.service';

const facets = [
  { name: 'mock', parameter: 'mock' },
  { name: 'mock1', parameter: 'mock1' },
];

class MockProductListPageService implements Partial<ProductListPageService> {
  get = vi.fn().mockImplementation(() => of([]));
}

class MockProductListService implements Partial<ProductListService> {
  get = vi.fn();
}

describe('DefaultFacetListService', () => {
  let service: FacetListService;
  let pageListService: ProductListPageService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ProductListPageService,
          useClass: MockProductListPageService,
        },
        {
          provide: FacetListService,
          useClass: DefaultFacetListService,
        },
        {
          provide: ProductListService,
          useClass: MockProductListService,
        },
      ],
    });

    service = testInjector.inject(FacetListService);
    pageListService = testInjector.inject(ProductListPageService);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultFacetListService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
    });

    it('should call mock product list page', () => {
      service.get().subscribe();
      expect(pageListService.get).toHaveBeenCalled();
    });

    describe('when product list does not contain facets', () => {
      const callback = vi.fn();
      beforeEach(() => {
        pageListService.get = vi.fn().mockReturnValue(of({}));
        service.get().subscribe(callback);
      });

      it('should return empty array', () => {
        expect(callback).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('getFacet', () => {
    beforeEach(() => {
      service.get = vi.fn().mockReturnValue(of(facets));
    });

    describe('when qualifier contains `name`', () => {
      const callback = vi.fn();
      beforeEach(() => {
        service.getFacet({ name: 'mock' }).subscribe(callback);
      });

      it('should return facet that matches name', () => {
        expect(callback).toHaveBeenCalledWith(facets[0]);
      });
    });

    describe('when qualifier contains `parameter`', () => {
      const callback = vi.fn();
      beforeEach(() => {
        service.getFacet({ parameter: 'mock1' }).subscribe(callback);
      });

      it('should return facet that matches parameter', () => {
        expect(callback).toHaveBeenCalledWith(facets[1]);
      });
    });

    describe('when facet with current qualifier is not found', () => {
      const callback = vi.fn();
      beforeEach(() => {
        service.getFacet({ name: 'mock2' }).subscribe(callback);
      });

      it('should return empty object', () => {
        expect(callback).toHaveBeenCalledWith({});
      });
    });
  });

  describe('getRangeFacetParams', () => {
    const parameter = 'mock';
    it('should return facet that matches name', () => {
      expect(service.getRangeFacetParams(parameter)).toEqual({
        min: `${parameter}[min]`,
        max: `${parameter}[max]`,
      });
    });
  });
});
