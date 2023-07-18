import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from 'libs/platform/form/src';
import { SiteNavigationItemComponent } from './navigation-item.component';

export const siteNavigationItemSchema: ContentComponentSchema<SiteNavigationItemComponent> =
  {
    name: 'Navigation item',
    group: 'Site',
    options: {
      label: {
        type: FormFieldType.Text,
      },
      icon: {
        type: FormFieldType.Text,
      },
      badge: {
        type: FormFieldType.Text,
      },
      url: {
        type: FormFieldType.Text,
      },
      triggerType: {
        type: FormFieldType.Select,
        options: [
          {
            value: 'button',
            text: 'Button',
          },
          {
            value: 'icon',
            text: 'Icon',
          },
          {
            value: 'storefront-button',
            text: 'Storefront Button',
          },
        ],
      },
      triggerBehavior: {
        type: FormFieldType.Select,
        options: [
          {
            value: 'click',
            text: 'Click',
          },
          {
            value: 'hover',
            text: 'Hover',
          },
        ],
      },
      contentBehavior: {
        type: FormFieldType.Select,
        options: [
          {
            value: 'modal',
            text: 'Modal',
          },
          {
            value: 'dropdown',
            text: 'Dropdown',
          },
          {
            value: 'navigation',
            text: 'Navigation',
          },
        ],
      },
    },
  };
