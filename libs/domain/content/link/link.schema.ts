import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { RouteType } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ColorType } from '@spryker-oryx/ui/link';
import { iconInjectable } from '@spryker-oryx/utilities';
import { ContentLinkComponent } from './link.component';

export const linkComponentSchema: ContentComponentSchema<
  ContentLinkComponent,
  { suggestion: unknown }
> = {
  name: 'Link',
  group: 'Content',
  icon: IconTypes.Link,
  options: {
    suggestion: {
      type: 'suggestion',
      width: 100,
    },
    url: { type: FormFieldType.Text },
    type: {
      type: FormFieldType.Select,
      options: [
        {
          value: RouteType.Page,
          text: 'Page',
        },
        {
          value: RouteType.Product,
          text: 'Product',
        },
        {
          value: RouteType.Category,
          text: 'Category',
        },
        {
          value: RouteType.ProductList,
          text: 'Search',
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
