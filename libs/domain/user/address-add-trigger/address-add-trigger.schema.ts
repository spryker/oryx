import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { UserAddressAddTriggerComponent } from './address-add-trigger.component';

export const userAddressAddTriggerSchema: ContentComponentSchema<UserAddressAddTriggerComponent> =
  {
    name: 'Address Add Trigger',
    group: 'User',
    icon: 'add',
    options: {
      target: {
        type: FormFieldType.Select,
        options: [{ value: 'link' }, { value: 'modal' }, { value: 'inline' }],
      },
    },
  };
