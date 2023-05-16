import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { LinkType } from '@spryker-oryx/ui/link';
import { ContentLinkComponent } from './link.component';

export const linkComponentSchema: ContentComponentSchema<ContentLinkComponent> =
  {
    name: 'Link',
    group: 'Content',
    icon: IconTypes.Link,
    options: {
      type: {
        label: 'Type',
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
        label: 'Target',
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
        label: 'Text',
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
        label: 'Icon',
        type: FormFieldType.Select,
        options: [
          {
            value: 'rocket',
            text: 'rocket',
          },
          {
            value: 'cart',
            text: 'cart',
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
      noopener: {
        label: 'noopener',
        type: FormFieldType.Boolean,
      },
      nofollow: {
        label: 'nofollow',
        type: FormFieldType.Boolean,
      },
      multiLine: {
        label: 'Multi line',
        type: FormFieldType.Boolean,
      },
    },
  };
