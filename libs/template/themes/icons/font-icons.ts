import { IconMapper } from '@spryker-oryx/experience';
// import { IconTypes } from './icon.model';

export const materialIcons: IconMapper = {
  id: 'material-icons',
  mapping: {
    // [IconTypes.Cart]: 'shopping_cart_checkout',
  },
};

export const fontAwesomeIcons: IconMapper = {
  id: 'fa',
  styles: `
    --icon-font: 'Font Awesome 6 Free';
  `,
  mapping: {
    // [IconTypes.User]: '&#xf007;',
  },
};
