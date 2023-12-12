import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { iconInjectable } from '@spryker-oryx/utilities';
import { LogoutLinkComponent } from './logout-link.component';

export const logoutLinkComponentSchema: ContentComponentSchema<LogoutLinkComponent> =
  {
    name: 'Logout Link',
    group: 'Auth',
    icon: IconTypes.Input,
    options: {
      redirectUrl: { type: FormFieldType.Text },
      icon: {
        type: FormFieldType.Select,
        options:
          iconInjectable
            .get()
            ?.getIcons()
            .sort()
            .map((i) => ({ value: i, text: i })) ?? [],
      },
    },
  };
