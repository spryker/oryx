import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { LoginLinkComponent } from './login-link.component';

export const loginLinkComponentSchema: ContentComponentSchema<LoginLinkComponent> =
  {
    name: 'Login button',
    group: 'Auth',
    options: {
      logoutRedirectUrl: {
        type: FormFieldType.Text,
      },
    },
  };
