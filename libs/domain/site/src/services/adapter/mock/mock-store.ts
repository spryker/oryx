import { Locale } from '@spryker-oryx/i18n';
import { Country, Currency, Store } from '@spryker-oryx/site';

export const Country1: Country = {
  iso2Code: 'DE',
  iso3Code: 'DEU',
  name: 'Germany',
  postalCodeMandatory: true,
  postalCodeRegex: 'd{5}',
};

export const Country2: Country = {
  iso2Code: 'AT',
  iso3Code: 'AUT',
  name: 'Austria',
  postalCodeMandatory: true,
  postalCodeRegex: '\\d{4}',
};

export const MockCurrency1: Currency = {
  code: 'EUR',
  name: 'Euro',
};

export const MockCurrency2: Currency = {
  code: 'CHF',
  name: 'Swiss Franc',
};

export const MockLocale1: Locale = {
  code: 'en',
  name: 'en_US',
};

export const MockLocale2: Locale = {
  code: 'de',
  name: 'de_DE',
};

export const MockStore: Store = {
  id: 'DE',
  countries: [Country1, Country2],
  currencies: [MockCurrency1, MockCurrency2],
  defaultCurrency: MockCurrency1.code,
  locales: [MockLocale1, MockLocale2],
  timeZone: 'Europe/Berlin',
};
