import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { AuthLogoutComponent } from './logout.component';

export const authLogoutComponentSchema: ContentComponentSchema<AuthLogoutComponent> =
  {
    name: 'Auth logout',
    group: 'Auth',
    options: {
      redirectUrl: {
        label: 'Redirect url',
        type: FormFieldType.Text,
      },
    },
  };
