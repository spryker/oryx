import { IconMapper } from '@spryker-oryx/experience';
import { IconTypes } from './icon.model';

export const materialIcons: IconMapper = {
  id: 'material-icons',
  mapping: {
    [IconTypes.List]: 'list',
    [IconTypes.ArrowsOutward]: 'arrows_outward',
    [IconTypes.ViewList]: 'view_list',
    [IconTypes.Composition]: 'shelf_position',
    [IconTypes.CartAdd]: 'add_shopping_cart',
    [IconTypes.Cart]: 'shopping_cart',
    [IconTypes.BulletList]: 'format_list_bulleted_add',
    [IconTypes.Login]: 'login',
    [IconTypes.Image]: 'image',
    [IconTypes.Link]: 'link',
    [IconTypes.Video]: 'play_circle',
    [IconTypes.Star]: 'star',
    [IconTypes.Description]: 'description',
    [IconTypes.Barcode]: 'barcode',
    [IconTypes.Images]: 'photo_library',
    [IconTypes.Label]: 'label',
    [IconTypes.Media]: 'perm_media',
    [IconTypes.Price]: 'payments',
    [IconTypes.Title]: 'title',
    [IconTypes.Card]: 'crop_portrait',
    [IconTypes.Input]: 'input',
    [IconTypes.Filters]: 'tune',
    [IconTypes.Search]: 'search',
    [IconTypes.Sort]: 'sort',
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
