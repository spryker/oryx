import { ContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  RouteType,
  RouteWithParams,
  RouterService,
} from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { of } from 'rxjs';
import { Product } from '../../../models';
import { ProductCategoryService } from '../../category';
import { ProductService } from '../../product.service';
import {
  ProductDetailsBreadcrumb,
  ProductDetailsBreadcrumbResolver,
} from './product-details.resolver';

const sku = 'mock';
const url = '/mock';

const category = {
  id: 'mock',
  name: 'mock',
  order: 1,
};

const mockProduct: Partial<Product> = {
  categoryIds: ['mock'],
  name: 'mock',
};

const route: Partial<RouteWithParams> = { params: { sku } };

class MockLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of(url));
}

class MockRouterService implements Partial<RouterService> {
  current = vi.fn().mockReturnValue(of(route));
}

class MockProductService implements Partial<ProductService> {
  get = vi.fn().mockReturnValue(of(mockProduct));
}

class MockCategoryService implements Partial<ProductCategoryService> {
  getTrail = vi.fn().mockReturnValue(of([category]));
}

class MockContextService implements Partial<ContextService> {
  get = vi.fn().mockReturnValue(of(sku));
}

describe('ProductDetailsBreadcrumbResolver', () => {
  let service: ProductDetailsBreadcrumbResolver;
  let linkService: MockLinkService;
  let contextService: ContextService;
  let productService: MockProductService;
  let categoryService: MockCategoryService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        ProductDetailsBreadcrumb,
        {
          provide: LinkService,
          useClass: MockLinkService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: ProductCategoryService,
          useClass: MockCategoryService,
        },
        {
          provide: ContextService,
          useClass: MockContextService,
        },
      ],
    });

    linkService = testInjector.inject<MockLinkService>(LinkService);
    contextService = testInjector.inject(ContextService);
    productService = testInjector.inject<MockProductService>(ProductService);
    categoryService = testInjector.inject<MockCategoryService>(
      ProductCategoryService
    );
    service = testInjector.inject(ProductDetailsBreadcrumb.provide);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('resolve', () => {
    const callback = vi.fn();

    beforeEach(() => {
      vi.useFakeTimers();
      service.resolve().subscribe(callback);
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should get the current route', () => {
      expect(contextService.get).toHaveBeenCalled();
    });

    it('should get the product by sku', () => {
      expect(productService.get).toHaveBeenCalledWith({ sku });
    });

    it('should get the trail by category id', () => {
      vi.advanceTimersByTime(1);
      expect(categoryService.getTrail).toHaveBeenCalledWith(category.id);
    });

    it('should build category link', () => {
      vi.advanceTimersByTime(1);
      expect(linkService.get).toHaveBeenCalledWith({
        id: category.id,
        type: RouteType.Category,
      });
    });

    it('should build the breadcrumbs', () => {
      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([
          { text: { raw: category.name }, url },
          { text: { raw: mockProduct.name } },
        ])
      );
    });

    describe('and there are not categories', () => {
      const callback = vi.fn();

      beforeEach(() => {
        vi.useFakeTimers();
        categoryService.getTrail = vi.fn().mockReturnValue(of([]));
        service.resolve().subscribe(callback);
      });

      afterEach(() => {
        vi.clearAllTimers();
      });

      it('should build a breadcrumb with token and values', () => {
        vi.advanceTimersByTime(1);

        expect(callback).toHaveBeenCalledWith(
          expect.arrayContaining([{ text: { raw: mockProduct.name } }])
        );
        expect(callback).toHaveBeenCalledWith([
          { text: { raw: mockProduct.name } },
        ]);
      });
    });
  });
});
