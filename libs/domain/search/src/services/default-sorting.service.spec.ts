import { Injector } from '@spryker-oryx/di';
import {
  ProductListPageService,
  ProductListService,
} from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import { DefaultSortingService } from './default-sorting.service';
import { SortingService } from './sorting.service';

class MockProductListPageService implements Partial<ProductListPageService> {
  get = vi.fn().mockImplementation(() => of([]));
}

class MockProductListService implements Partial<ProductListService> {
  get = vi.fn();
}

describe('DefaultSortingService', () => {
  let service: SortingService;
  let pageListService: ProductListPageService;
  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
      {
        provide: ProductListPageService,
        useClass: MockProductListPageService,
      },
      {
        provide: SortingService,
        useClass: DefaultSortingService,
      },
      {
        provide: ProductListService,
        useClass: MockProductListService,
      },
    ]);

    service = testInjector.inject(SortingService);
    pageListService = testInjector.inject(ProductListPageService);
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultSortingService);
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
});
