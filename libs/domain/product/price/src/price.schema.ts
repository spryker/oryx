import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductPriceComponent } from './price.component';

export const productPriceSchema: ContentComponentSchema<ProductPriceComponent> =
  {
    name: 'Product Price',
    group: 'Product',
    icon: IconTypes.Price,
    options: {
      enableOriginalPrice: { type: FormFieldType.Boolean },
      enableSalesLabel: { type: FormFieldType.Boolean },
      enableTaxMessage: { type: FormFieldType.Boolean },
    },
  };
