import { FormFieldType } from '@spryker-oryx/form';
import { ContentComponentSchema } from '../../../../../models';
import { ObjectFit } from './image-style.model';

export const schema: ContentComponentSchema = {
  name: 'image',
  group: 'layout',
  options: {
    imagePosition: {
      type: FormFieldType.Text,
    },
    imageFit: {
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
