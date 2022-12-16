import { Injector } from '@spryker-oryx/injector';
import {
  ProductListPageService,
  ProductListService,
} from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import { DefaultFacetListService } from './default-facet-list.service';
import { FacetListService } from './facet-list.service';

class MockProductListPageService implements Partial<ProductListPageService> {
  get = vi.fn().mockImplementation(() => of([]));
}

class MockProductListService implements Partial<ProductListService> {
  get = vi.fn();
}

describe('DefaultFacetListService', () => {
  let service: FacetListService;
  let pageListService: ProductListPageService;
  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
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
    ]);

    service = testInjector.inject(FacetListService);
    pageListService = testInjector.inject(ProductListPageService);
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultFacetListService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
    });

    it('should call mock product list page', () => {
      const callback = vi.fn();
      service.get().subscribe(callback);
      expect(pageListService.get).toHaveBeenCalled();
    });
  });

  describe('getFacet', () => {
    beforeEach(() => {
      service.get = vi.fn().mockReturnValue(of([]));
    });

    it('should return an observable', () => {
      expect(service.getFacet({ name: 'mock' })).toBeInstanceOf(Observable);
    });

    it('should call mock product list page', () => {
      service.getFacet({ name: 'mock' }).subscribe(vi.fn());

      expect(service.get).toHaveBeenCalled();
    });
  });
});
