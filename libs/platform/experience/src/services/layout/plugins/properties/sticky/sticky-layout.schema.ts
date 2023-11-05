import { FormFieldType } from '@spryker-oryx/form';
import { ContentComponentSchema } from '../../../../../models';

export const schema: ContentComponentSchema = {
  name: 'sticky',
  group: 'layout',
  options: {
    zIndex: { type: FormFieldType.Number, kind: 'style' },
    overflow: {
      type: FormFieldType.Select,
      options: [{ value: 'auto' }, { value: 'scroll' }, { value: 'hidden' }],
    },
  },
};
