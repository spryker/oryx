import { ResourceIcons } from '@spryker-oryx/experience';
import { IconTypes } from '../icon.model';

export const storefrontIcons: ResourceIcons = {
  [IconTypes.CartAdd]: () => import('./icons/cart-add').then((s) => s.default),
  [IconTypes.Cart]: () => import('./icons/cart').then((s) => s.default),
};
