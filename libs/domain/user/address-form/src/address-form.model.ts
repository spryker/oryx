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
   * In case some country has no based address, should fallback to this country address format.
   */
  fallbackCountry?: string;
}

export interface AddressFormAttributes {
  country?: string;
  fallbackCountry?: string;
  enableDefaultShipping?: boolean;
  enableDefaultBilling?: boolean;
}
