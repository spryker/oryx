import { FormFieldType } from '@spryker-oryx/form';
import { ContentComponentSchema } from '../../../../../models';

export const schema: ContentComponentSchema = {
  name: 'spacing',
  group: 'layout',
  options: {
    padding: { type: FormFieldType.Text },
    margin: { type: FormFieldType.Text },
    width: { type: FormFieldType.Text },
    height: { type: FormFieldType.Text },
    top: { type: FormFieldType.Text },
  },
};
