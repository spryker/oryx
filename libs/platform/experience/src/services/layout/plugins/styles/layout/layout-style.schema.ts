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
  name: 'misc',
  group: 'layout',
  options: {
    align: { type: FormFieldType.Select, options: alignOptions },
    justify: { type: FormFieldType.Select, options: alignOptions },
    colSpan: { type: FormFieldType.Number },
    gridColumn: { type: FormFieldType.Number },
    gridRow: { type: FormFieldType.Number },
    rowSpan: { type: FormFieldType.Number },
    gap: { type: FormFieldType.Text },
    columnCount: { type: FormFieldType.Number },
  },
};
