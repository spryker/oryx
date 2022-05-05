import { DefaultProductAdapter } from './adapter/default-product.adapter';
import { ProductAdapter } from './adapter/product.adapter';
import { DefaultProductService } from './default-product.service';
import { ProductService } from './product.service';

export const PRODUCT_PROVIDERS = [
  {
    provide: ProductAdapter,
    useClass: DefaultProductAdapter,
  },
  {
    provide: ProductService,
    useClass: DefaultProductService,
  },
];
