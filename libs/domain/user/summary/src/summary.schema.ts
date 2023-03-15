import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { UserSummaryComponent } from './summary.component';
import { MenuItemTypes } from './summary.model';

export const userSummaryComponentSchema: ContentComponentSchema<UserSummaryComponent> =
  {
    name: 'User summary',
    group: 'User',
    options: {
      url: {
        type: FormFieldType.Text,
        width: 100,
      },
      eventName: {
        type: FormFieldType.Text,
        width: 100,
      },
      type: {
        type: FormFieldType.Select,
        width: 100,
        // List for POC purpose
        options: [
          {
            value: MenuItemTypes.Button,
            text: MenuItemTypes.Button,
          },
          {
            value: MenuItemTypes.Icon,
            text: MenuItemTypes.Icon,
          },
        ],
      },
      icon: {
        type: FormFieldType.Select,
        width: 100,
        // List for POC purpose
        options: [
          {
            value: 'user',
            text: 'user',
          },
          {
            value: 'add',
            text: 'add',
          },
          {
            value: 'minus',
            text: 'minus',
          },
          {
            value: 'mark',
            text: 'mark',
          },
        ],
      },
    },
  };
