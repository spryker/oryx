import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { FormFieldType } from 'libs/platform/form/src';
import { ProductIdComponent } from './id.component';

export const productIdSchema: ContentComponentSchema<ProductIdComponent> = {
  name: 'Product Id',
  group: 'Product',
  icon: IconTypes.Barcode,
  options: { prefix: { type: FormFieldType.Text } },
};
