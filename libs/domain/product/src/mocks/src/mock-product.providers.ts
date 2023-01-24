import {
  DefaultFeatureOptionsService,
  FeatureOptionsService,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  DefaultProductAdapter,
  DefaultProductImageService,
  DefaultProductListPageService,
  DefaultProductListService,
  ProductAdapter,
  ProductImageService,
  ProductListAdapter,
  ProductListPageService,
  ProductListService,
  productMediaConfig,
  ProductMediaConfig,
  ProductService,
} from '@spryker-oryx/product';
import { MockProductService } from './mock-product.service';
import { MockProductListAdapter } from './product-list';

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
  // TODO: remove when `defaultOptionsClass` will be refactored
  {
    provide: FeatureOptionsService,
    useClass: DefaultFeatureOptionsService,
  },
];
