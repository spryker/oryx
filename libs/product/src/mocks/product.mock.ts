import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { MOCK_PRODUCT_PROVIDERS } from './mock-product.providers';

export function setupProductMocks(): void {
  destroyInjector();
  createInjector({
    providers: [...MOCK_PRODUCT_PROVIDERS],
  });
}
