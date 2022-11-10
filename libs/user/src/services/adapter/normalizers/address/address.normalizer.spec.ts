import { DeserializedAddress } from '../model';
import { addressAttributesNormalizer } from './address.normalizer';

const mockAddress = {
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
  id: 'dab2851f-71ae-550d-b4b5-4477adcde826',
};

const mockDeserializedAddress = {
  ...mockAddress,
  links: {
    self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/customers/DE--34/addresses/dab2851f-71ae-550d-b4b5-4477adcde826',
  },
} as DeserializedAddress;

describe('Address Normalizers', () => {
  describe('Address Attributes Normalizer', () => {
    it('should transform DeserializedAddress into Address', () => {
      const normalized = addressAttributesNormalizer(mockDeserializedAddress);
      expect(normalized).toEqual({
        ...mockAddress,
        links: mockDeserializedAddress.links,
      });
    });
  });
});
