import { ProductService } from '../services/product.service';
import { MockProductService } from './mock-product.service';

export const MOCK_PRODUCT_PROVIDERS = [
  {
    provide: ProductService,
    useClass: MockProductService,
  },
];
