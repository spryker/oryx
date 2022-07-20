import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { ProductService } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { MOCK_CART_PROVIDERS } from './mock-cart.providers';

export const setupCartMocks = (): void => {
  destroyInjector();
  createInjector({
    providers: [
      ...MOCK_CART_PROVIDERS,
      {
        provide: ProductService,
        useClass: MockProductService,
      },
    ],
  });
};
