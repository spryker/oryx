import { ComponentGroup, ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { ContentLinkComponent } from './link.component';

export const linkComponentSchema: ContentComponentSchema<ContentLinkComponent> =
  {
    name: 'Link',
    group: ComponentGroup.Content,
    icon: '<path d="M17.3 13.35a1 1 0 0 1-.7-.29 1 1 0 0 1 0-1.41l2.12-2.12a2 2 0 0 0 0-2.83L17.3 5.28a2.06 2.06 0 0 0-2.83 0L12.35 7.4A1 1 0 0 1 10.94 6l2.12-2.12a4.1 4.1 0 0 1 5.66 0l1.41 1.41a4 4 0 0 1 0 5.66L18 13.06a1 1 0 0 1-.7.29ZM8.11 21.3a4 4 0 0 1-2.83-1.17l-1.41-1.41a4 4 0 0 1 0-5.66L6 10.94a1 1 0 0 1 1.4 1.41l-2.12 2.12a2 2 0 0 0 0 2.83l1.42 1.42a2.06 2.06 0 0 0 2.83 0l2.12-2.12a1 1 0 1 1 1.41 1.4l-2.12 2.12a4 4 0 0 1-2.83 1.18Z" fill="#464646"/><path d="M8.82 16.18a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42l6.37-6.36a1 1 0 0 1 1.41 0 1 1 0 0 1 0 1.42l-6.37 6.36a1 1 0 0 1-.7.29Z" fill="#464646"/>',
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
