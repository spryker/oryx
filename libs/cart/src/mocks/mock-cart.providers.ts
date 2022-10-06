import { mockCoreProviders } from '@spryker-oryx/core';
import { CartService, DefaultCartService } from '../services';
import { CartAdapter } from '../services/adapter/cart.adapter';
import { MockCartAdapter } from './mock-cart.adapter';

export const mockCartProviders = [
  ...mockCoreProviders,
  {
    provide: CartAdapter,
    useClass: MockCartAdapter,
  },
  {
    provide: CartService,
    useClass: DefaultCartService,
  },
];
