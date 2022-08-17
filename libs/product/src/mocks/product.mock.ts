import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { mockProductProviders } from './mock-product.providers';

export function setupProductMocks(): void {
  destroyInjector();
  createInjector({
    providers: [...mockProductProviders],
  });
}
