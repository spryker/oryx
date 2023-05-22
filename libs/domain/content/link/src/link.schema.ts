import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { LinkType } from '@spryker-oryx/ui/link';
import { iconInjectable } from '@spryker-oryx/utilities';
import { ContentLinkComponent } from './link.component';

export const linkComponentSchema: ContentComponentSchema<ContentLinkComponent> =
  {
    name: 'Link',
    group: 'Content',
    icon: IconTypes.Link,
    options: {
      type: {
        type: FormFieldType.Select,
        options: [
          {
            value: 'rawUrl',
            text: 'RawUrl',
          },
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
      text: {
        type: FormFieldType.Text,
      },
      id: {
        label: 'Raw URL | Product/Category/Page ID',
        type: FormFieldType.Text,
      },
      linkType: {
        type: FormFieldType.Select,
        options: [
          { value: LinkType.Link },
          { value: LinkType.ExternalLink },
          { value: LinkType.Neutral },
        ],
      },
      icon: {
        type: FormFieldType.Select,
        options:
          iconInjectable
            .get()
            ?.getIcons()
            .map((i) => ({ value: i, text: i })) ?? [],
      },
      noopener: {
        type: FormFieldType.Boolean,
      },
      nofollow: {
        type: FormFieldType.Boolean,
      },
      multiLine: {
        type: FormFieldType.Boolean,
      },
    },
  };
