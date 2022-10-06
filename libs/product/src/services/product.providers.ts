import {
  ConcreteProductsNormalizers,
  concreteProductsNormalizers,
  DefaultProductAdapter,
  DefaultProductListAdapter,
  imagesNormalizers,
  ImagesNormalizers,
  priceNormalizers,
  PriceNormalizers,
  ProductAdapter,
  ProductListAdapter,
  productNormalizers,
  ProductNormalizers,
} from './adapter';
import {
  productLabelsNormalizers,
  ProductLabelsNormalizers,
} from './adapter/normalizers/labels/labels.normalizer';

import { Provider } from '@spryker-oryx/injector';
import {
  productListNormalizers,
  ProductListNormalizers,
} from './adapter/normalizers/product-list';
import { DefaultProductListPageService } from './default-product-list-page.service';
import { DefaultProductListService } from './default-product-list.service';
import { DefaultProductService } from './default-product.service';
import { ProductListPageService } from './product-list-page.service';
import { ProductListService } from './product-list.service';
import { ProductService } from './product.service';

export const productProviders: Provider[] = [
  {
    provide: ProductAdapter,
    useClass: DefaultProductAdapter,
  },
  {
    provide: ProductService,
    useClass: DefaultProductService,
  },
  {
    provide: ProductListAdapter,
    useClass: DefaultProductListAdapter,
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
    provide: PriceNormalizers,
    useValue: priceNormalizers,
  },
  {
    provide: ProductLabelsNormalizers,
    useValue: productLabelsNormalizers,
  },
  {
    provide: ImagesNormalizers,
    useValue: imagesNormalizers,
  },
  {
    provide: ProductNormalizers,
    useValue: productNormalizers,
  },
  {
    provide: ProductListNormalizers,
    useValue: productListNormalizers,
  },
  {
    provide: ConcreteProductsNormalizers,
    useValue: concreteProductsNormalizers,
  },
];
