import { addressAttributesSerializer } from './address.serializer';

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

describe('Address Serializers', () => {
  describe('Address Attributes Serializer', () => {
    it('should transform Address into Payload', () => {
      const mockResult = {
        type: 'addresses',
        attributes: mockAddress,
      };

      const serialized = addressAttributesSerializer(mockAddress);
      expect(serialized).toEqual(mockResult);
    });
  });
});
