import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { MOCK_CART_PROVIDERS } from './mock-cart.providers';

export const setupCartMocks = (): void => {
  destroyInjector();
  createInjector({
    providers: [...MOCK_CART_PROVIDERS],
  });
};
