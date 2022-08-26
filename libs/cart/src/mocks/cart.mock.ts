import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { ProductService } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { siteProviders } from '@spryker-oryx/site';
import { mockCartProviders } from './mock-cart.providers';

export const setupCartMocks = (): any =>
  setUpMockProviders([
    ...siteProviders,
    ...mockCartProviders,
    {
      provide: ContextService,
      useClass: DefaultContextService,
    },
    {
      provide: ProductService,
      useClass: MockProductService,
    },
  ]);
