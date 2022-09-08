import {
  ConcreteProductsNormalizers,
  concreteProductsNormalizers,
  DefaultProductAdapter,
  imagesNormalizers,
  ImagesNormalizers,
  priceNormalizers,
  PriceNormalizers,
  ProductAdapter,
  productNormalizers,
  ProductNormalizers,
} from './adapter';

import {
  productListNormalizers,
  ProductListNormalizers,
} from './adapter/normalizers/product-list';
import { DefaultProductListService } from './default-product-list.service';
import { DefaultProductService } from './default-product.service';
import { ProductListService } from './product-list.service';
import { ProductService } from './product.service';

export const productProviders = [
  {
    provide: ProductAdapter,
    useClass: DefaultProductAdapter,
  },
  {
    provide: ProductService,
    useClass: DefaultProductService,
  },
  {
    provide: ProductListService,
    useClass: DefaultProductListService,
  },
  {
    provide: PriceNormalizers,
    useValue: priceNormalizers,
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
