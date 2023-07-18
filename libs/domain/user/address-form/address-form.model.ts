import { FormFieldDefinition } from '@spryker-oryx/form';

export interface AddressForm {
  id: string;
  name: string;
  data: {
    options: FormFieldDefinition[];
  };
}

export interface AddressFormOptions {
  /**
   * Used to fallback to a specific country, when there's no country specific address
   * form model found.
   */
  fallbackCountry?: string;
}

export interface AddressFormAttributes {
  /**
   * The country isocode is used to resolve a country specific form model. This is used
   * to support address formats for different countries.
   */
  country?: string;

  /**
   * Indicates whether a checkbox is added to the form to set the address as the
   * default shipping address. When there's no default shipping address available
   * in the list of addresses, we set the value to true.
   */
  enableDefaultShipping?: boolean;

  /**
   * Indicates whether a checkbox is added to the form to set the address as the
   * default billing address. When there's no default billing address available
   * in the list of addresses, we set the value to true.
   */
  enableDefaultBilling?: boolean;
}
