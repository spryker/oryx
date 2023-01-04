import { Provider } from '@spryker-oryx/di';
import {
  CartAdapter,
  cartNormalizer,
  cartsNormalizer,
  DefaultCartAdapter,
} from './adapter';
import { CartService } from './cart.service';
import { componentsProvider } from './components.provider';
import { DefaultCartService } from './default-cart.service';

export const cartProviders: Provider[] = [
  componentsProvider,
  {
    provide: CartAdapter,
    useClass: DefaultCartAdapter,
  },
  {
    provide: CartService,
    useClass: DefaultCartService,
  },
  ...cartNormalizer,
  ...cartsNormalizer,
];
