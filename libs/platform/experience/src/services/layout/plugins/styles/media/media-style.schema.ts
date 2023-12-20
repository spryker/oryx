import { FormFieldType } from '@spryker-oryx/form';
import { ContentComponentSchema } from '../../../../../models';
import { ObjectFit } from './media-style.model';

export const schema: ContentComponentSchema = {
  name: 'media',
  group: 'layout',
  options: {
    objectPosition: {
      type: FormFieldType.Text,
    },
    objectFit: {
      type: FormFieldType.Select,
      options: [
        { value: ObjectFit.Contain },
        { value: ObjectFit.Fill },
        { value: ObjectFit.Cover },
        { value: ObjectFit.None },
        { value: ObjectFit.ScaleDown },
      ],
    },
  },
};
