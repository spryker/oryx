import {
  ContextService,
  DefaultContextService,
  IdentityService,
} from '@spryker-oryx/core';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { ProductService } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { siteProviders } from '@spryker-oryx/site';
import { of } from 'rxjs';
import { mockCartProviders } from './mock-cart.providers';

class MockIdentityService implements Partial<IdentityService> {
  get() {
    return of({ id: 'id', anonymous: true });
  }
}

export const setupCartMocks = (): (() => void) =>
  setUpMockProviders([
    ...siteProviders,
    ...mockCartProviders,
    {
      provide: IdentityService,
      useClass: MockIdentityService,
    },
    {
      provide: ContextService,
      useClass: DefaultContextService,
    },
    {
      provide: ProductService,
      useClass: MockProductService,
    },
  ]);
