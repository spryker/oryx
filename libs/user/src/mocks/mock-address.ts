export const mockAddressBase = {
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
  company: null,
  phone: '22111-3-4-5',
  isDefaultShipping: false,
  isDefaultBilling: false,
};

export const mockAddress = {
  ...mockAddressBase,
  id: 'addressid',
};

export const mockCurrentAddressBase = {
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
  company: null,
  phone: '22111-3-4-5',
  isDefaultShipping: true,
  isDefaultBilling: true,
};

export const mockCurrentAddress = {
  ...mockCurrentAddressBase,
  id: 'currentaddressid',
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

export const mockGetAddressesResponse = {
  data: [mockAddressResponse, mockCurrentAddressResponse],
  links: 'addresseslink',
};

export const mockNormalizedAddresses = [mockCurrentAddress, mockAddress];
