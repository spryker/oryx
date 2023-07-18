import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductLabelsComponent } from './label.component';

export const productLabelSchema: ContentComponentSchema<ProductLabelsComponent> =
  {
    name: 'Product Labels',
    group: 'Product',
    icon: IconTypes.Label,
    options: {
      included: { type: FormFieldType.Text },
      excluded: { type: FormFieldType.Text },
      invert: { type: FormFieldType.Boolean },
    },
  };
