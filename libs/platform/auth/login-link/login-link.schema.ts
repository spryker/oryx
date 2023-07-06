import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { LoginLinkComponent } from './login-link.component';

export const loginLinkComponentSchema: ContentComponentSchema<LoginLinkComponent> =
  {
    name: 'Login Link',
    group: 'Auth',
    icon: IconTypes.Input,
    options: {
      logoutRedirectUrl: {
        type: FormFieldType.Text,
      },
    },
  };
