import { IconMapper } from '@spryker-oryx/experience';
import { IconTypes } from './icon.model';

export const materialMapper: IconMapper = {
  id: 'material-icons',
  styles: `
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
  `,
  mapping: {
    [IconTypes.Cart]: 'shopping_cart_checkout',
  },
};

export const fontAwesomeMapper: IconMapper = {
  id: 'fa',
  styles: `
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
  `,
  mapping: {
    [IconTypes.User]: '&#xf007;',
  },
};
