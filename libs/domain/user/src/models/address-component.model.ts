import { Address } from './address.model';

export interface AddressComponentProperties {
  /**
   * Identifier of address entry
   */
  addressId?: string;

  /**
   * Address entity
   */
  addressData?: Address;
}
