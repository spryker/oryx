import { mockAddress } from '@spryker-oryx/user/mocks';
import { DeserializedAddress } from '../model';
import { addressAttributesNormalizer } from './address.normalizer';

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
