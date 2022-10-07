import { Provider } from '@spryker-oryx/injector';
import {
  DefaultProductAdapter,
  DefaultProductListPageService,
  DefaultProductListService,
  ProductAdapter,
  ProductListAdapter,
  ProductListPageService,
  ProductListService,
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
];
