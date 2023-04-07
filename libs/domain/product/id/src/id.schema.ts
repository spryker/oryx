import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { ProductIdComponent } from './id.component';

export const productIdSchema: ContentComponentSchema<ProductIdComponent> = {
  name: 'Product Id',
  group: 'Product',
  icon: '<path d="M2 19V5H5V19H2ZM6 19V5H7V19H6ZM9 19V5H11V19H9ZM13 19V5H15V19H13ZM16 19V5H17V19H16ZM20 19V5H22V19H20Z" />',
  options: { prefix: { type: FormFieldType.Text } },
};
