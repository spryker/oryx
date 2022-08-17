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

import { DefaultProductService } from './default-product.service';
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
    provide: ConcreteProductsNormalizers,
    useValue: concreteProductsNormalizers,
  },
];
