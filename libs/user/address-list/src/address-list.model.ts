export const ADDRESS_CHANGE_EVENT = 'oryx.address-change';

export const enum AddressType {
  Shipping = 'shipping',
  Billing = 'billing',
}

export interface AddressListOptions {
  defaultType?: AddressType;
  selectable?: boolean;
  editable?: boolean;
}
