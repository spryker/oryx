import { ComponentTypeDataFields } from '@spryker-oryx/form';

export interface AddressForm {
  id: string;
  name: string;
  data: {
    options: ComponentTypeDataFields[];
  };
}

export interface AddressFormOptions {
  /**
   * In case some country has no based address, should fallback to this country address format.
   */
  fallbackCountry?: string;
}
