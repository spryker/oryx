import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { FormFieldType } from 'libs/platform/form/src';
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
