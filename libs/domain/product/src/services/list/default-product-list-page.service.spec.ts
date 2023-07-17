import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouteParams, RouterService } from '@spryker-oryx/router';
import { Observable, of } from 'rxjs';
import { Pagination } from '../../models';
import { DefaultProductListPageService } from './default-product-list-page.service';
import { ProductListPageService } from './product-list-page.service';
import { ProductListService } from './product-list.service';

const mockPagination: Pagination = {
  itemsPerPage: 0,
  currentPage: 0,
  maxPage: 0,
  numFound: 0,
};

const mockCurrentQuery: RouteParams = {
  page: '3',
  brand: 'mockBrand',
};

class MockRouterService implements Partial<RouterService> {
  currentQuery = vi.fn().mockReturnValue(of(mockCurrentQuery));
  getPathId = vi.fn().mockReturnValue('');
}

class MockProductListService implements Partial<ProductListService> {
  get = vi.fn().mockReturnValue(
    of({
      pagination: mockPagination,
    })
  );
}

describe('DefaultProductListPageService', () => {
  let service: ProductListPageService;
  let routerService: RouterService;
  let productListService: ProductListService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: ProductListService,
          useClass: MockProductListService,
        },
        {
          provide: ProductListPageService,
          useClass: DefaultProductListPageService,
        },
      ],
    });

    service = testInjector.inject(ProductListPageService);
    routerService = testInjector.inject(RouterService);
    productListService = testInjector.inject(ProductListService);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultProductListPageService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
    });

    it('should call get() method of ProductListService', () => {
      service.get().subscribe();
      expect(productListService.get).toHaveBeenCalledWith(mockCurrentQuery);
    });

    it('should return proper data', () => {
      service.get().subscribe((res) => {
        expect(res).toEqual({ pagination: mockPagination });
      });
    });
  });

  describe('getPagination', () => {
    it('should return an observable', () => {
      expect(service.getPagination()).toBeInstanceOf(Observable);
    });

    it('should return proper data', () => {
      service.getPagination().subscribe((res) => {
        expect(res).toEqual(mockPagination);
      });
    });
  });
});
