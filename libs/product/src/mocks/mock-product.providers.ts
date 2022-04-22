import { ProductDomain } from '../models';
import { MockProductService } from './mock-product.service';

export const MOCK_PRODUCT_PROVIDERS = [
  {
    provide: ProductDomain.ProductService,
    useClass: MockProductService,
  },
];
