import { FormFieldType } from '@spryker-oryx/form';
import { ContentComponentSchema } from '../../../../../models';
import { LayoutAlign } from '../../../layout.model';

const alignOptions = [
  { value: LayoutAlign.Start },
  { value: LayoutAlign.End },
  { value: LayoutAlign.Stretch },
  { value: LayoutAlign.Center },
  { value: LayoutAlign.SpaceBetween },
  { value: LayoutAlign.SpaceAround },
  { value: LayoutAlign.SpaceEvenly },
];

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
