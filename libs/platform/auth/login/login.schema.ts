import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { FormFieldType } from 'libs/platform/form/src';
import { AuthLoginComponent } from './login.component';

export const loginComponentSchema: ContentComponentSchema<AuthLoginComponent> =
  {
    name: 'Auth Login',
    group: 'Auth',
    icon: IconTypes.Login,
    options: {
      enableRememberMe: { type: FormFieldType.Boolean },
      forgotPasswordLink: { type: FormFieldType.Boolean },
      enableRedirect: { type: FormFieldType.Boolean },
      passwordVisibility: {
        type: FormFieldType.Select,
        options: [
          { value: PasswordVisibilityStrategy.None },
          { value: PasswordVisibilityStrategy.Mousedown },
          { value: PasswordVisibilityStrategy.Click },
          { value: PasswordVisibilityStrategy.Hover },
        ],
      },
      redirectUrl: { type: FormFieldType.Text },
    },
  };
