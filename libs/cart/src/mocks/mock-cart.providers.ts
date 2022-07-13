import {
  CartService,
  DefaultCartService,
  DefaultUserService,
  UserService,
} from '../services';
import { CartAdapter } from '../services/adapter/cart.adapter';
import { MockCartAdapter } from './mock-cart.adapter';

export const MOCK_CART_PROVIDERS = [
  {
    provide: CartAdapter,
    useClass: MockCartAdapter,
  },
  {
    provide: CartService,
    useClass: DefaultCartService,
  },
  {
    provide: UserService,
    useClass: DefaultUserService,
  },
];
