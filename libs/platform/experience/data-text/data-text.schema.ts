import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { DataTextComponent } from './data-text.component';

export const dataTextSchema: ContentComponentSchema<DataTextComponent> = {
  name: 'Data text',
  group: 'Experience',
  icon: 'wysiwyg',
  options: {
    field: { type: FormFieldType.Text },
    entity: { type: FormFieldType.Text },
    tag: {
      type: FormFieldType.Select,
      options: [
        { value: HeadingTag.H1 },
        { value: HeadingTag.H2 },
        { value: HeadingTag.H3 },
        { value: HeadingTag.H4 },
        { value: HeadingTag.H5 },
        { value: HeadingTag.H6 },
        { value: HeadingTag.Small },
        { value: HeadingTag.Strong },
        { value: HeadingTag.Subtitle },
        { value: HeadingTag.SubtitleSmall },
        { value: HeadingTag.Caption },
      ],
    },
    prefix: { type: FormFieldType.Text },
    link: { type: FormFieldType.Boolean, width: 100 },
  },
};
