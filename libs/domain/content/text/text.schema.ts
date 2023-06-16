import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { ContentTextComponent } from './text.component';

export const contentTextSchema: ContentComponentSchema<ContentTextComponent> = {
  name: 'Text',
  group: 'Content',
  icon: 'wysiwyg',
  options: {
    tag: {
      type: FormFieldType.Select,
      options: [1, 2, 3, 4, 5, 6].map((n) => ({ value: `h${n}` })),
    },
  },
  content: {
    text: {
      type: FormFieldType.Text,
    },
  },
};
