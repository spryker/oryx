import { IconMapper } from '@spryker-oryx/experience';

export const materialIcons: IconMapper = {
  id: 'material-icons',
  styles: `
    font-family: 'Material Symbols Outlined';
  `,
  mapping: {
    // [IconTypes.Cart]: 'shopping_cart_checkout',
  },
};

export const fontAwesomeIcons: IconMapper = {
  id: 'fa',
  styles: `
    font-family: 'Font Awesome 6 Free';
    font-size: calc(var(--oryx-icon-size, 24px) * 0.7);
    align-self: center;
  `,
  mapping: {
    // [IconTypes.User]: '&#xf007;',
  },
};
