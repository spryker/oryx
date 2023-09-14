import { Locale } from '@spryker-oryx/i18n';

export interface Country {
  /**
   * 2 digit country code
   */
  iso2Code: string;
  /**
   * 3 digit country code
   */
  iso3Code?: string;
  /**
   * country name
   */
  name: string;
  /**
   * Boolean to tell if a postal code is mandatory or not.
   */
  postalCodeMandatory: boolean;
  /**
   * Regular expression for the allowed postal codes.
   */
  postalCodeRegex: string;
  regions?: Array<unknown>;
}

export interface Currency {
  name: string;
  code: string;
}

export interface Store {
  id: string;
  countries: Country[];
  currencies: Currency[];
  defaultCurrency: string;
  locales: Locale[];
  timeZone: string;
}
