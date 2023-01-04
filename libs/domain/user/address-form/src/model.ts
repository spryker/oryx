import { ComponentTypeDataFields } from '@spryker-oryx/form';

export interface AddressForm {
  id: string;
  name: string;
  data: {
    options: ComponentTypeDataFields[];
  };
}
