import { IconMapper } from '@spryker-oryx/experience';
import { IconTypes } from './icon.model';

export const materialIcons: IconMapper = {
  id: 'material-icons',
  mapping: {
    [IconTypes.List]: 'list',
    [IconTypes.User]: 'person',
    [IconTypes.Users]: 'group',
    [IconTypes.ArrowsOutward]: 'arrows_outward',
    [IconTypes.ViewList]: 'view_list',
    [IconTypes.Composition]: 'shelf_position',
    [IconTypes.CartAdd]: 'add_shopping_cart',
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

    [IconTypes.Collapse]: 'expand_more',
    [IconTypes.Mark]: 'expand_more', // merge with Collapse
    [IconTypes.Dropdown]: 'expand_more', // merge with Collapse
    [IconTypes.Expand]: 'expand_less',
    [IconTypes.DropUp]: 'expand_less', // merge with expand
    [IconTypes.Back]: 'chevron_left',

    [IconTypes.Wishlist]: 'favorite',
    [IconTypes.Visible]: 'visibility',
    [IconTypes.Invisible]: 'visibility_off',
    [IconTypes.Add]: 'add',
    [IconTypes.Increase]: 'add', // merge with add
    [IconTypes.Minus]: 'remove',
    [IconTypes.Decrease]: 'remove', // merge with minus
    [IconTypes.Trash]: 'delete',
    [IconTypes.Rocket]: 'rocket',

    [IconTypes.Error]: 'error',
    [IconTypes.InputError]: 'error', // merge with error
    [IconTypes.Info]: 'info',
    [IconTypes.Success]: 'check_circle',
    [IconTypes.Warning]: 'warning',
  },
};

export const fontAwesomeIcons: IconMapper = {
  id: 'fa',
  styles: `
    --oryx-icon-font: 'Font Awesome 6 Free';
  `,
  mapping: {
    [IconTypes.User]: '&#xf007;',
  },
};

export const fontIcons = {
  [materialIcons.id]:
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  [fontAwesomeIcons.id]:
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
};
