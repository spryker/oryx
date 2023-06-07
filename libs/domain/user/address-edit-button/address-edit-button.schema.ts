import { ContentComponentSchema } from '@spryker-oryx/experience';
import { UserAddressEditButtonComponent } from './address-edit-button.component';

export const userAddressEditTriggerSchema: ContentComponentSchema<UserAddressEditButtonComponent> =
  {
    name: 'Address Edit trigger',
    group: 'User',
    icon: 'edit',
    options: {},
  };
