import { createInjector } from '@spryker-oryx/injector';
import { MOCK_PRODUCT_PROVIDERS } from '../mocks';

export function setupProductMocks(): void {
  createInjector({
    providers: MOCK_PRODUCT_PROVIDERS,
    override: true,
  });
}
