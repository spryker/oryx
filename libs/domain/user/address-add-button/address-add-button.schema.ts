import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from 'libs/platform/form/src';
import { UserAddressAddButtonComponent } from './address-add-button.component';

export const userAddressAddButtonSchema: ContentComponentSchema<UserAddressAddButtonComponent> =
  {
    name: 'Address Add Button',
    group: 'User',
    icon: 'add',
    options: {
      target: {
        type: FormFieldType.Select,
        options: [{ value: 'link' }, { value: 'modal' }, { value: 'inline' }],
      },
    },
  };
