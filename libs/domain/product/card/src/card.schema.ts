import { ComponentGroup, ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { ProductCardComponent } from './card.component';

export const productCardComponentSchema: ContentComponentSchema<ProductCardComponent> =
  {
    name: 'Product card',
    group: ComponentGroup.Product,
    options: {
      sku: {
        label: 'SKU',
        type: 'sku',
        width: 100,
      },
      enableTitle: {
        label: 'Enable title',
        type: FormFieldType.Boolean,
      },
      titleLineClamp: {
        label: 'Title line clamp',
        type: FormFieldType.Text,
        attributes: {
          type: 'number',
        },
      },
      enableMedia: {
        label: 'Enables media',
        type: FormFieldType.Boolean,
      },
      enablePrice: {
        label: 'Enables price',
        type: FormFieldType.Boolean,
      },
      enableRating: {
        label: 'Enables rating',
        type: FormFieldType.Boolean,
      },
      enableLabels: {
        label: 'Enables labels',
        type: FormFieldType.Boolean,
      },
      enableWishlist: {
        label: 'Enables wishlist',
        type: FormFieldType.Boolean,
      },
      enableAddToCart: {
        label: 'Enables add to cart',
        type: FormFieldType.Boolean,
      },
    },
  };
