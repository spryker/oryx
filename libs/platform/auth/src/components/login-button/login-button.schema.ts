import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { LoginButtonComponent } from './login-button.component';

export const loginButtonComponentSchema: ContentComponentSchema<LoginButtonComponent> =
  {
    name: 'Login button',
    group: 'Auth',
    options: {
      logoutRedirectUrl: {
        type: FormFieldType.Text,
      },
    },
  };
