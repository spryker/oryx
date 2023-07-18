import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { FormFieldType } from 'libs/platform/form/src';
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
