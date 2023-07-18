import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ColorType } from '@spryker-oryx/ui/link';
import { iconInjectable } from '@spryker-oryx/utilities';
import { FormFieldType } from 'libs/platform/form/src';
import { ContentLinkComponent } from './link.component';

export const linkComponentSchema: ContentComponentSchema<ContentLinkComponent> =
  {
    name: 'Link',
    group: 'Content',
    icon: IconTypes.Link,
    options: {
      url: { type: FormFieldType.Text },
      type: {
        type: FormFieldType.Select,
        options: [
          {
            value: 'page',
            text: 'Page',
          },
          {
            value: 'product',
            text: 'Product',
          },
          {
            value: 'category',
            text: 'Category',
          },
        ],
      },
      target: {
        type: FormFieldType.Select,
        options: [
          {
            value: '_blank',
            text: '_blank',
          },
          {
            value: '_self',
            text: '_self',
          },
          {
            value: '_parent',
            text: '_parent',
          },
          {
            value: '_top',
            text: '_top',
          },
        ],
      },
      id: {
        label: 'Product/Category/Page ID',
        type: FormFieldType.Text,
      },
      color: {
        type: FormFieldType.Select,
        options: [{ value: ColorType.Primary }, { value: ColorType.Neutral }],
      },
      icon: {
        type: FormFieldType.Select,
        options:
          iconInjectable
            .get()
            ?.getIcons()
            .sort()
            .map((i) => ({ value: i, text: i })) ?? [],
      },
      noopener: { type: FormFieldType.Boolean },
      nofollow: { type: FormFieldType.Boolean },
      singleLine: { type: FormFieldType.Boolean },
    },
    content: { text: { type: FormFieldType.Text } },
  };
