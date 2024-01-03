import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
export const schema: ContentComponentSchema = {
  name: 'collapsible',
  group: 'layout',
  buckets: {
    prefix: ['label'],
  },
  options: {
    collapsibleOpen: {
      type: FormFieldType.Boolean,
    },
  },
};
