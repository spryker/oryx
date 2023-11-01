import { IconMapper } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

export const fontawesomeIcons: IconMapper = {
  id: 'fa',
  styles: {
    font: 'Font Awesome 6 Free',
    weight: 900,
  },
  mapping: {
    [IconTypes.User]: '&#xf007;',
    [IconTypes.Sales]: '&#xf555;',
    [IconTypes.Users]: '&#xf508;',
    [IconTypes.ModeDark]: '&#xf186;',
    [IconTypes.ModeLight]: '&#xf185;',
    [IconTypes.Orders]: '&#xf218;',
    [IconTypes.Desktop]: '&#xf390;',
    [IconTypes.Mobile]: '&#xf3cd;',
    [IconTypes.Tablet]: '&#xf3fa;',
    [IconTypes.Bottom]: '&#xe4b8;',
    [IconTypes.Copy]: '&#xf0c5;',
    [IconTypes.Create]: '&#xf0fe;',
    [IconTypes.Disconnect]: '&#xe55e;',
    [IconTypes.File]: '&#xf15b;',
    [IconTypes.Filters]: '&#xf085;',
    [IconTypes.Imports]: '&#xf019;',
    [IconTypes.InputStepper]: '&#xf0d8;',
    [IconTypes.Link]: '&#xf08e;',
    [IconTypes.Menu]: '&#xf0c9;',
    [IconTypes.Top]: '&#xe4c2;',
    [IconTypes.List]: '&#xf03a;',
    [IconTypes.ArrowsOutward]: '&#xf337;',
    [IconTypes.ViewList]: '&#xf00b;',
    [IconTypes.Composition]: '&#xf00a;',
    [IconTypes.BulletList]: '&#xf0ca;',
    [IconTypes.Login]: '&#xf090;',
    [IconTypes.Video]: '&#xf03d;',
    [IconTypes.Description]: '&#xf46d;',
    [IconTypes.Barcode]: '&#xf02a;',
    [IconTypes.Images]: '&#xf302;',
    [IconTypes.Label]: '&#xf02b;',
    [IconTypes.Media]: '&#xf87c;',
    [IconTypes.Price]: '&#xf0d6;',
    [IconTypes.Title]: '&#xf1dc;',
    [IconTypes.Card]: '&#xf249;',
    [IconTypes.Input]: '&#xf2f6;',
    [IconTypes.Parcel]: '&#xf466;',
    [IconTypes.Forward]: '&#xf054;',
    [IconTypes.Previous]: '&#xf060;',
    [IconTypes.Next]: '&#xf061;',
  },
};

export const fontawesomeLink = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  [fontawesomeIcons.id!]:
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
};
