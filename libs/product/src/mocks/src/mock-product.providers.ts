import { Provider } from '@spryker-oryx/injector';
import { ProductListAdapter, ProductService } from '@spryker-oryx/product';
import { MockProductService } from './mock-product.service';
import { MockProductListAdapter } from './product-list';

export const mockProductProviders: Provider[] = [
  {
    provide: ProductService,
    useClass: MockProductService,
  },
  {
    provide: ProductListAdapter,
    useClass: MockProductListAdapter,
  },
];
