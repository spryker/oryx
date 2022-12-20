export interface AddressListItemOptions {
  defaultShipping?: boolean;
  defaultBilling?: boolean;
  selectable?: boolean;
  editable?: boolean;
  removable?: boolean;
}

export interface AddressListItemAttributes {
  addressId?: string;
}

export const EDIT_EVENT = 'oryx.edit';
export const REMOVE_EVENT = 'oryx.remove';
