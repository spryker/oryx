import { Address } from '../../models';

export const mockAddressBase: Address = {
  salutation: 'Mr',
  firstName: 'Spencor',
  lastName: 'Hopkin',
  address1: 'Third, 33, 11',
  address2: 'b',
  address3: 'bbb',
  zipCode: '12312',
  city: 'Berlin',
  country: 'Germany',
  iso2Code: 'DE',
  company: 'company',
  phone: '22111-3-4-5',
  isDefaultShipping: false,
  isDefaultBilling: true,
};

export const mockAddress: Address = {
  ...mockAddressBase,
  id: 'addressid',
};

export const mockCurrentAddressBase: Address = {
  salutation: 'Ms',
  firstName: 'abc',
  lastName: 'mock',
  address1: '2, 33, 11',
  address2: 'b',
  address3: 'aaa',
  zipCode: '12312',
  city: 'Berlin',
  country: 'Germany',
  iso2Code: 'DE',
  company: 'company',
  phone: '22111-3-4-5',
  isDefaultShipping: true,
  isDefaultBilling: false,
};

export const mockCurrentAddress: Address = {
  ...mockCurrentAddressBase,
  id: 'currentaddressid',
};

export const mockAddressSecondaryBase: Address = {
  salutation: 'Mr',
  firstName: 'Spencor',
  lastName: 'Hopkin',
  address1: 'Second, 3, 112',
  address2: 'address2',
  address3: 'address3',
  zipCode: '12312',
  city: 'Berlin',
  country: 'Germany',
  iso2Code: 'DE',
  company: 'company',
  phone: '22111-3-4-5',
  isDefaultShipping: false,
  isDefaultBilling: false,
};

export const mockAddressSecondary: Address = {
  ...mockAddressSecondaryBase,
  id: 'secondary_id',
};

export const mockAddressResponse = {
  type: 'addresses',
  id: mockAddress.id,
  links: 'link',
  attributes: mockAddressBase,
};

export const mockCurrentAddressResponse = {
  type: 'addresses',
  id: mockCurrentAddress.id,
  links: 'currentlink',
  attributes: mockCurrentAddressBase,
};

export const mockAddressSecondaryResponse = {
  type: 'addresses',
  id: mockAddressSecondary.id,
  links: 'secondary_link',
  attributes: mockAddressSecondaryBase,
};

export const mockGetAddressesResponse = {
  data: [
    mockAddressResponse,
    mockCurrentAddressResponse,
    mockAddressSecondaryResponse,
  ],
  links: 'addresseslink',
};

export const mockNormalizedAddresses = [
  mockCurrentAddress,
  mockAddress,
  mockAddressSecondary,
];
