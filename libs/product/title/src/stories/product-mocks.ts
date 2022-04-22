import { createInjector } from '@spryker-oryx/injector';
import { MOCK_PRODUCT_PROVIDERS } from '../../../src/mocks/mock-product.providers';

export function setupProductMocks(_ctx: unknown) {
  createInjector({
    providers: MOCK_PRODUCT_PROVIDERS,
    override: true,
  });
}
