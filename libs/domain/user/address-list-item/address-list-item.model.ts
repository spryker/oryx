export enum AddressDefaults {
  All = 'all',
  Billing = 'billing',
  Shipping = 'shipping',
}

export interface AddressListItemOptions {
  addressDefaults?: AddressDefaults;
  selectable?: boolean;
  editable?: boolean;
  removable?: boolean;
  editTarget?: EditTarget;
}

export const enum EditTarget {
  Inline = 'inline',
  Link = 'link',
  Modal = 'modal',
}
