import { componentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { ProductCardOptions } from './card.model';

@componentSchema({
  name: 'Product card',
  category: 'Commerce',
  group: 'Product',
})
export class ProductComponentSchema implements ProductCardOptions {
  @componentSchema({
    label: 'SKU',
    type: 'sku',
    width: 100,
  })
  sku?: string;

  @componentSchema({
    label: 'Enable title',
    type: FormFieldType.Boolean,
  })
  enableTitle?: boolean;

  @componentSchema({
    label: 'Title line clamp',
    type: FormFieldType.Text,
    attributes: {
      type: 'number',
    },
  })
  titleLineClamp?: number;

  @componentSchema({
    label: 'Enables media',
    type: FormFieldType.Boolean,
  })
  enableMedia?: boolean;

  @componentSchema({
    label: 'Enables price',
    type: FormFieldType.Boolean,
  })
  enablePrice?: boolean;

  @componentSchema({
    label: 'Enables rating',
    type: FormFieldType.Boolean,
  })
  enableRating?: boolean;

  @componentSchema({
    label: 'Enables labels',
    type: FormFieldType.Boolean,
  })
  enableLabels?: boolean;

  @componentSchema({
    label: 'Enables wishlist',
    type: FormFieldType.Boolean,
  })
  enableWishlist?: boolean;

  @componentSchema({
    label: 'Enables add to cart',
    type: FormFieldType.Boolean,
  })
  enableAddToCart?: boolean;
}
