import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { FormFieldType } from 'libs/platform/form/src';
import { ProductCardComponent } from './card.component';

export const productCardComponentSchema: ContentComponentSchema<ProductCardComponent> =
  {
    name: 'Product Card',
    group: 'Product',
    icon: IconTypes.Card,
    options: {
      sku: {
        type: 'sku',
        width: 100,
      },
      enableTitle: {
        type: FormFieldType.Boolean,
      },
      titleLineClamp: {
        type: FormFieldType.Text,
        attributes: {
          type: 'number',
        },
      },
      enableMedia: {
        type: FormFieldType.Boolean,
      },
      enablePrice: {
        type: FormFieldType.Boolean,
      },
      enableRating: {
        type: FormFieldType.Boolean,
      },
      enableLabels: {
        type: FormFieldType.Boolean,
      },
      enableWishlist: {
        type: FormFieldType.Boolean,
      },
      enableAddToCart: {
        type: FormFieldType.Boolean,
      },
    },
  };
