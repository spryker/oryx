import { IconMapper } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

export const fulfillmentIcons: IconMapper = {
  svg: true,
  mapping: {
    [IconTypes.Cart]: () => import('./icons/cart').then((s) => s.default),
    [IconTypes.Loader]: () => import('./icons/loader').then((s) => s.default),
    [IconTypes.Remove]: () => import('./icons/remove').then((s) => s.default),
  },
};
