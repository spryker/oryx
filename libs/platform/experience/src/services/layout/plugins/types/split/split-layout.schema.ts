import { FormFieldType } from '@spryker-oryx/form';
import { ContentComponentSchema } from '../../../../../models';

export const schema: ContentComponentSchema = {
  name: 'split',
  group: 'layout',
  options: {
    columnWidthType: {
      type: FormFieldType.Select,
      options: [{ value: 'equal' }, { value: 'main' }, { value: 'aside' }],
    },
  },
};
