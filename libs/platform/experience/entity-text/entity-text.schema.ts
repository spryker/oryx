import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { EntityTextComponent } from './entity-text.component';

export const entityTextSchema: ContentComponentSchema<EntityTextComponent> = {
  name: 'Entity text',
  group: 'Experience',
  icon: IconTypes.Edit,
  options: {
    entity: {
      type: FormFieldType.Text,
    },
    field: {
      type: FormFieldType.Text,
    },
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
    prefix: {
      type: FormFieldType.Text,
    },
    // link: {
    //   type: FormFieldType.Boolean,
    // },
  },
};
