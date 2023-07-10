import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { UserAddressEditComponent } from './address-edit.component';

export const userAddressEditSchema: ContentComponentSchema<UserAddressEditComponent> =
  {
    name: 'Address Edit',
    group: 'User',
    icon: 'edit_note',
    options: {
      save: {
        type: FormFieldType.Select,
        options: [{ value: 'instant' }, { value: 'save' }, { value: 'none' }],
      },
      inline: {
        type: FormFieldType.Boolean,
      },
    },
  };
