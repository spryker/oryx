import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { ProductService } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { mockCartProviders } from './mock-cart.providers';

export const setupCartMocks = (): void => {
  destroyInjector();
  createInjector({
    providers: [
      ...mockCartProviders,
      {
        provide: ProductService,
        useClass: MockProductService,
      },
    ],
  });
};
