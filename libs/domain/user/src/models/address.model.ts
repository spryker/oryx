export interface Address {
  id?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  email?: string;
  company?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  idCompanyBusinessUnitAddress?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
  iso2Code?: string;
  phone?: string;
  salutation?: string;
  zipCode?: string;
}

export interface AddressEventDetail {
  // action?: CrudState;
  address?: Address;
  valid?: boolean;
}

// TODO: move elsewhere
export const enum CrudState {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  // Select = 'select',
}
