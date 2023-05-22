import {
  IconMapper,
  IconSource,
  ResourceFonts,
} from '@spryker-oryx/experience';
import { IconTypes } from '../icon.model';

export const storefrontMaterialIcons: IconMapper = {
  id: 'material-icons',
  mapping: {
    [IconTypes.Increase]: 'add', // merge with add
    [IconTypes.Back]: 'chevron_left',
    [IconTypes.Carrier]: 'local_shipping',
    [IconTypes.Collapse]: 'expand_more',
    [IconTypes.Mark]: 'expand_more', // merge with Collapse
    [IconTypes.Dropdown]: 'expand_more', // merge with Collapse
    [IconTypes.Close]: 'close',
    [IconTypes.Calendar]: 'calendar_month',
    [IconTypes.Expand]: 'expand_less',
    [IconTypes.DropUp]: 'expand_less', // merge with expand
    [IconTypes.InputError]: 'error', // merge with error
    [IconTypes.Minus]: 'remove',
    [IconTypes.Decrease]: 'remove', // merge with minus
    [IconTypes.Printer]: 'print',
    [IconTypes.Trash]: 'delete',
    [IconTypes.Rocket]: 'rocket',
    [IconTypes.Success]: 'check_circle',
    [IconTypes.Invisible]: 'visibility_off',
    [IconTypes.Wishlist]: 'favorite',
    [IconTypes.Location]: 'location_on',
    [IconTypes.NavigationArrow]: 'arrow_right_alt',
    [IconTypes.Actions]: 'more_vert',
    [IconTypes.User]: 'person',
    [IconTypes.Image]: 'photo_library',
  },
};

export const storefrontFontAwesomeIcons: IconMapper = {
  id: 'fa',
  styles: {
    font: 'Font Awesome 6 Free',
    weight: 900,
  },
  mapping: {
    [IconTypes.Parcel]: '&#xf466;',
  },
};

export const storefrontIconSources: IconSource[] = [
  {
    resource: storefrontFontAwesomeIcons,
    types: [IconTypes.Parcel],
  },
];

export const storefrontFontIcons: ResourceFonts = {
  [storefrontMaterialIcons.id]:
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block',
  [storefrontFontAwesomeIcons.id]:
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
};
