import { Provider } from '@spryker-oryx/di';
import {
  DefaultProductAdapter,
  DefaultProductImageService,
  DefaultProductListPageService,
  DefaultProductListService,
  ProductAdapter,
  ProductCategoryService, ProductContext,
  ProductImageService,
  ProductListAdapter,
  ProductListPageService,
  ProductListService,
  productMediaConfig,
  ProductMediaConfig,
  ProductRelationsListService,
  ProductService
} from '@spryker-oryx/product';
import { MockProductCategoryService } from './mock-category.service';
import { MockProductService } from './mock-product.service';
import { MockProductListAdapter } from './product-list';
import { MockProductRelationsListService } from './product-relations/mock-product-relations-list.service';
import { provideEntity } from '@spryker-oryx/core';

export const mockProductProviders: Provider[] = [
  {
    provide: ProductAdapter,
    useClass: DefaultProductAdapter,
  },
  {
    provide: ProductService,
    useClass: MockProductService,
  },
  {
    provide: ProductListAdapter,
    useClass: MockProductListAdapter,
  },
  {
    provide: ProductListService,
    useClass: DefaultProductListService,
  },
  {
    provide: ProductListPageService,
    useClass: DefaultProductListPageService,
  },
  {
    provide: ProductImageService,
    useClass: DefaultProductImageService,
  },
  {
    provide: ProductMediaConfig,
    useValue: productMediaConfig,
  },
  {
    provide: ProductRelationsListService,
    useClass: MockProductRelationsListService,
  },
  {
    provide: ProductCategoryService,
    useClass: MockProductCategoryService,
  },
  provideEntity('product', {
    service: ProductService,
    context: ProductContext.SKU,
  }),
];
