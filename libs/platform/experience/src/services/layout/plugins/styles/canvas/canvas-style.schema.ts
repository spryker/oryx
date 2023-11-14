import { FormFieldType } from '@spryker-oryx/form';
import { ContentComponentSchema } from '../../../../../models';

export const schema: ContentComponentSchema = {
  name: 'canvas',
  group: 'layout',
  options: {
    radius: { type: FormFieldType.Text },
    border: { type: FormFieldType.Text },
    background: { type: FormFieldType.Color, width: 100 },
    fill: { type: FormFieldType.Color, width: 100 },
  },
};
