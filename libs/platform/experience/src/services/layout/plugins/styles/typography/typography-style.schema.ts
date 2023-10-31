import { FormFieldType } from '@spryker-oryx/form';
import { ContentComponentSchema } from '../../../../../models';

export const schema: ContentComponentSchema = {
  name: 'typography',
  group: 'layout',
  options: {
    typography: { type: FormFieldType.Text },
  },
};
