import { ContentComponentSchema } from '@spryker-oryx/experience';
import { UserAddressEditTriggerComponent } from './address-edit-trigger.component';

export const userAddressEditTriggerSchema: ContentComponentSchema<UserAddressEditTriggerComponent> =
  {
    name: 'Address Edit trigger',
    group: 'User',
    icon: 'edit',
    options: {},
  };
