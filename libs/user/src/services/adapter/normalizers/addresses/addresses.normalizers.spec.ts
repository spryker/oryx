import { of, take } from 'rxjs';
import { DeserializedAddress } from '../';
import { AddressNormalizers } from '../address';
import { addressesNormalizer } from './addresses.normalizers';

const mockDeserializedAddresses = [
  {
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
  },
  {
    salutation: 'Mr',
    firstName: 'Spencor',
    lastName: 'Hopkin',
    address1: 'Third, 33, 11',
    address2: 'b',
    address3: 'aaa',
    zipCode: '12312',
    city: 'Berlin',
    country: 'Germany',
    iso2Code: 'DE',
    company: null,
    phone: '22111-3-4-5',
    isDefaultShipping: false,
    isDefaultBilling: false,
    id: '334139a3-08dc-5b70-a73c-bcf6bb13504e',
  },
] as unknown as DeserializedAddress[];

describe('Addresses Normalizers', () => {
  describe('Addresses Normalizer', () => {
    it('should transform DeserializedAddress array into Address array', () => {
      const mockTransformed = 'mockTransformed';
      const mockTransformer = {
        do: vi.fn().mockReturnValue(() => of(mockTransformed)),
        transform: vi.fn().mockReturnValue(of(mockTransformed)),
      };
      addressesNormalizer(mockDeserializedAddresses, mockTransformer)
        .pipe(take(1))
        .subscribe((normalized) => {
          expect(mockTransformer.transform).toHaveBeenCalledWith(
            mockDeserializedAddresses[0],
            AddressNormalizers
          );

          expect(mockTransformer.transform).toHaveBeenCalledWith(
            mockDeserializedAddresses[1],
            AddressNormalizers
          );
          expect(normalized).toEqual([mockTransformed, mockTransformed]);
        });
    });
  });
});
