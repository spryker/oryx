import { JsonApiModel } from '@spryker-oryx/typescript-utils';

export module ApiAddressModel {
  export interface Address {
    id?: string | null;
    address1: string | null;
    address2: string | null;
    address3?: string | null;
    city: string | null;
    email?: string | null;
    company?: string | null;
    country?: string | null;
    firstName: string | null;
    lastName: string | null;
    idCompanyBusinessUnitAddress?: string | null;
    isDefaultShipping: boolean | null;
    isDefaultBilling: boolean | null;
    iso2Code: string | null;
    phone?: string | null;
    salutation: string | null;
    zipCode: string | null;
  }

  export interface Payload {
    type: 'addresses';
    id?: string;
    links?: unknown;
    attributes: Address;
  }

  export type ResponseList = JsonApiModel<Address, unknown, Array<unknown>>;
}
