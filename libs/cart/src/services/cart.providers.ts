import { CartAdapter, DefaultCartAdapter } from './adapter';
import { CartService } from './cart.service';
import { DefaultCartService } from './default-cart.service';
import { DefaultUserService } from './default-user.service';
import { UserService } from './user.service';

export const CART_PROVIDERS = [
  {
    provide: CartAdapter,
    useClass: DefaultCartAdapter,
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
