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
}

export interface AddressListItemAttributes {
  addressId?: string;
}

export const EDIT_EVENT = 'oryx.edit';
export const REMOVE_EVENT = 'oryx.remove';
