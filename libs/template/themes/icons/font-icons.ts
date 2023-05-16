import { IconMapper } from '@spryker-oryx/experience';
// import { IconTypes } from './icon.model';

export const materialIcons: IconMapper = {
  id: 'material-icons',
  styles: `
    font-family: 'Material Symbols Outlined';
    font-size: var(--oryx-icon-size, 24px);
    align-self: center;
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
