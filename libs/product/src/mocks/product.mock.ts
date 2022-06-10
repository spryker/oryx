import { createInjector, resolve } from '@spryker-oryx/injector';
import { MOCK_PRODUCT_PROVIDERS } from './mock-product.providers';

export function setupProductMocks(): void {
  // temporary solution to ensure that stories will benefit from
  // changes in services. Somehow, services will not emit their changes
  // when they're changed inside stories, i.e. changing the price in the
  // product price demo story.
  if (resolve<any>(undefined, 'MOCKS', '') !== 'productMocks') {
    createInjector({
      providers: [
        ...MOCK_PRODUCT_PROVIDERS,
        {
          provide: 'MOCKS',
          useValue: 'productMocks',
        },
      ],
      override: true,
    });
  }
}
