import { ProductDomain } from '../models';
import { DefaultProductAdapter } from './adapter/default-product.adapter';
import { DefaultProductService } from './default-product.service';

export const PRODUCT_PROVIDERS = [
  {
    provide: ProductDomain.ProductAdapter,
    useClass: DefaultProductAdapter,
  },
  {
    provide: ProductDomain.ProductService,
    useClass: DefaultProductService,
  },
];
