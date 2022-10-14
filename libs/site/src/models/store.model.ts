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
