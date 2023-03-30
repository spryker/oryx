import {
  ComponentGroup,
  ContentComponentSchema,
} from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { AuthButtonComponent } from './button.component';

export const authButtonComponentSchema: ContentComponentSchema<AuthButtonComponent> =
  {
    name: 'Auth button',
    group: ComponentGroup.Auth,
    options: {
      logoutRedirectUrl: {
        type: FormFieldType.Text,
      },
    },
  };
