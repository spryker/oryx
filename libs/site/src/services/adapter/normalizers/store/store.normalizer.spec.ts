import { storeAttributesNormalizer } from './store.normalizer';

const mockStore = {
  id: 'DE',
  timeZone: 'Europe/Berlin',
  defaultCurrency: 'EUR',
  currencies: [
    { code: 'EUR', name: 'Euro' },
    { code: 'CHF', name: 'Swiss Franc' },
  ],
  locales: [{ code: 'en', name: 'en_US' }],
  countries: [
    {
      iso2Code: 'DE',
      iso3Code: 'DEU',
      name: 'Germany',
      postalCodeMandatory: true,
      postalCodeRegex: '\\d{5}',
      regions: [],
    },
  ],
};

const mockDeserializedStores = [
  {
    ...mockStore,
    id: mockStore.id,
    links: {
      self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/stores/DE',
    },
  },
];

describe('Store Normalizers', () => {
  describe('Store Attributes Normalizer', () => {
    it('should transform DeserializedStore into Store[]', () => {
      const normalized = storeAttributesNormalizer(mockDeserializedStores);
      expect(normalized).toEqual(mockDeserializedStores);
    });
  });
});
