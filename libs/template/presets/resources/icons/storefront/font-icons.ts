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
    [IconTypes.ModeLight]: 'light_mode',
    [IconTypes.ModeDark]: 'dark_mode',
    [IconTypes.Ratings]: 'reviews',
    [IconTypes.Planet]: 'language',
    [IconTypes.Locker]: 'lock',
    [IconTypes.Images]: 'images',
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
    [IconTypes.Visible]: '&#xf06e;',
    [IconTypes.Invisible]: '&#xf070;',
    [IconTypes.Profile]: '&#xf007;',
    [IconTypes.Customer]: '&#xf007;',
    [IconTypes.Sales]: '&#xf555;',
    [IconTypes.Users]: '&#xf508;',
    [IconTypes.Orders]: '&#xf218;',
    [IconTypes.Desktop]: '&#xf390;',
    [IconTypes.Mobile]: '&#xf3cd;',
    [IconTypes.Tablet]: '&#xf3fa;',
    [IconTypes.Disconnect]: '&#xe55e;',
    [IconTypes.Video]: '&#xf03d;',
    [IconTypes.Composition]: '&#xf00a;',
    [IconTypes.Media]: '&#xf87c;',
    [IconTypes.Price]: '&#xf0d6;',
    [IconTypes.Card]: '&#xf249;',
    [IconTypes.Top]: '&#xe4c2;',
    [IconTypes.Bottom]: '&#xe4b8;',
    [IconTypes.Filters]: '&#xf085;',
    [IconTypes.BulletList]: '&#xf0ca;',
    [IconTypes.ArrowsOutward]: '&#xf337;',
    [IconTypes.ViewList]: '&#xf00b;',
    [IconTypes.InputStepper]: '&#xf0d8;',
    [IconTypes.Imports]: '&#xf019;',
    [IconTypes.Copy]: '&#xf0c5;',
    [IconTypes.File]: '&#xf15b;',
    [IconTypes.Imports]: '&#xf019;',
  },
};

export const storefrontIconSources: IconSource[] = [
  {
    resource: storefrontFontAwesomeIcons,
    types: [
      IconTypes.Parcel,
      IconTypes.Visible,
      IconTypes.Invisible,
      IconTypes.Profile,
      IconTypes.Customer,
      IconTypes.Sales,
      IconTypes.Users,
      IconTypes.Orders,
      IconTypes.Desktop,
      IconTypes.Mobile,
      IconTypes.Tablet,
      IconTypes.Disconnect,
      IconTypes.Video,
      IconTypes.Composition,
      IconTypes.Media,
      IconTypes.Price,
      IconTypes.Card,
      IconTypes.Top,
      IconTypes.Bottom,
      IconTypes.Filters,
      IconTypes.BulletList,
      IconTypes.ArrowsOutward,
      IconTypes.ViewList,
      IconTypes.InputStepper,
      IconTypes.Imports,
      IconTypes.Copy,
      IconTypes.File,
      IconTypes.Imports,
    ],
  },
];

export const storefrontFontIcons: ResourceFonts = {
  [storefrontMaterialIcons.id]:
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block',
  [storefrontFontAwesomeIcons.id]:
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
};
