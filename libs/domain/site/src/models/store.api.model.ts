import { JsonApiModel } from '@spryker-oryx/utilities';

export module ApiStoreModel {
  export interface Country {
    iso2Code: string;
    iso3Code?: string;
    name: string;
    postalCodeMandatory: boolean;
    postalCodeRegex: string;
    regions?: Array<unknown>;
  }

  export interface Attributes {
    id: string;
    countries: Country[];
    currencies: Currency[];
    defaultCurrency: string;
    locales: Locale[];
    timeZone: string;
    links?: unknown;
  }

  export interface Currency {
    name: string;
    code: string;
  }

  export interface Locale {
    name: string;
    code: string;
  }

  export type Response = JsonApiModel<Attributes, unknown>;
}
