import { FormFieldType } from '@spryker-oryx/form';
import { ContentComponentSchema } from '../../../../../models';
import { ShadowElevation } from './canvas-style.model';

export const schema: ContentComponentSchema = {
  name: 'canvas',
  group: 'layout',
  options: {
    radius: { type: FormFieldType.Text },
    border: { type: FormFieldType.Text },
    background: { type: FormFieldType.Color, width: 100 },
    fill: { type: FormFieldType.Color, width: 100 },
    shadow: {
      type: FormFieldType.Select,
      options: [
        { value: ShadowElevation.Flat },
        { value: ShadowElevation.Raised },
        { value: ShadowElevation.Floating },
        { value: ShadowElevation.Hovering },
      ],
    },
  },
};
