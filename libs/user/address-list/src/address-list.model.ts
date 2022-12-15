export const SELECT_EVENT = 'oryx.select';
export const EDIT_EVENT = 'oryx.edit';
export const REMOVE_EVENT = 'oryx.remove';

export const enum AddressType {
  Shipping = 'shipping',
  Billing = 'billing',
}

export interface AddressListOptions {
  defaultType?: AddressType;
  selectable?: boolean;
  editable?: boolean;
}
