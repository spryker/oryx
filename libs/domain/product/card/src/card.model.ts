import { componentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';

export class ComponentSchema {
  /** The product SKU is used to resolve the product. */
  @componentSchema({
    label: 'SKU',
    type: 'sku',
    width: 100,
  })
  sku?: string;

  /** Indicates whether the product title should be rendered  */
  @componentSchema({
    label: 'Enable title',
    type: FormFieldType.Boolean,
  })
  enableTitle?: boolean;

  /**
   * Indicates maximum amount of lines instantly visible. If there are more lines
   * available, they'll be  truncated.
   */
  @componentSchema({
    label: 'Title line clamp',
    type: FormFieldType.Text,
    attributes: {
      type: 'number',
    },
  })
  titleLineClamp?: number;

  /** Indicates whether the product media (image) should be rendered  */
  @componentSchema({
    label: 'Enables media',
    type: FormFieldType.Boolean,
  })
  enableMedia?: boolean;

  /** Indicates whether the product price should be rendered  */
  @componentSchema({
    label: 'Enables price',
    type: FormFieldType.Boolean,
  })
  enablePrice?: boolean;

  /** Indicates whether the product rating should be rendered  */
  @componentSchema({
    label: 'Enables rating',
    type: FormFieldType.Boolean,
  })
  enableRating?: boolean;

  /** Indicates whether the product labels should be rendered  */
  @componentSchema({
    label: 'Enables labels',
    type: FormFieldType.Boolean,
  })
  enableLabels?: boolean;

  /** Indicates whether the add to favorites button should be rendered  */
  @componentSchema({
    label: 'Enables wishlist',
    type: FormFieldType.Boolean,
  })
  enableWishlist?: boolean;

  /** Indicates whether the add to cart should be rendered  */
  @componentSchema({
    label: 'Enables add to cart',
    type: FormFieldType.Boolean,
  })
  enableAddToCart?: boolean;
}
