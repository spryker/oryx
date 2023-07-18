import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductIdComponent } from './id.component';

export const productIdSchema: ContentComponentSchema<ProductIdComponent> = {
  name: 'Product Id',
  group: 'Product',
  icon: IconTypes.Barcode,
  options: { prefix: { type: FormFieldType.Text } },
};
