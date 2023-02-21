import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { AuthLoginComponent } from './login.component';

export const loginComponentSchema: ContentComponentSchema<AuthLoginComponent> =
  {
    type: 'oryx-auth-login',
    name: 'Auth Login',
    group: 'Auth',
    icon: '<path d="M12.2 21.15V19.45H19.5V4.54998H12.2V2.84998H19.5C19.9667 2.84998 20.3709 3.01664 20.7125 3.34998C21.0542 3.68331 21.225 4.08331 21.225 4.54998V19.45C21.225 19.9 21.0542 20.2958 20.7125 20.6375C20.3709 20.9791 19.9667 21.15 19.5 21.15H12.2ZM10.15 16.6L8.92502 15.375L11.45 12.85H2.77502V11.15H11.4L8.87502 8.62498L10.1 7.39998L14.7 12.025L10.15 16.6Z" />',
    options: {
      enableRememberMe: { type: FormFieldType.Boolean },
      enableForgotPassword: { type: FormFieldType.Boolean },
      disableRedirect: { type: FormFieldType.Boolean },
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
