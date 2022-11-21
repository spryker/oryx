import { JsonApiModel } from '@spryker-oryx/utilities';

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
    isDefaultShipping: boolean;
    isDefaultBilling: boolean;
    iso2Code: string | null;
    phone?: string | null;
    salutation: string | null;
    zipCode: string | null;
  }

  export interface Payload {
    type: 'addresses';
    id?: string;
    links?: unknown;
    attributes: Partial<Address>;
  }

  export type ResponseList = JsonApiModel<Address, unknown, Array<unknown>>;
}
