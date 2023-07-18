import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from 'libs/platform/form/src';
import { UserAddressEditButtonComponent } from './address-edit-button.component';

export const userAddressEditTriggerSchema: ContentComponentSchema<UserAddressEditButtonComponent> =
  {
    name: 'Address Edit Button',
    group: 'User',
    icon: 'edit',
    options: {
      target: {
        type: FormFieldType.Select,
        options: [{ value: 'link' }, { value: 'modal' }, { value: 'inline' }],
      },
    },
  };
