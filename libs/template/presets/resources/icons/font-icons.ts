import { IconMapper } from '@spryker-oryx/experience';

export const materialIcons: IconMapper = {
  id: 'material-icons',
  mapping: {
    // [IconTypes.Cart]: 'shopping_cart_checkout',
  },
};

export const fontAwesomeIcons: IconMapper = {
  id: 'fa',
  styles: `
    --oryx-icon-font: 'Font Awesome 6 Free';
  `,
  mapping: {
    // [IconTypes.User]: '&#xf007;',
  },
};

export const fontIcons = {
  [materialIcons.id]:
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  [fontAwesomeIcons.id]:
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
};
