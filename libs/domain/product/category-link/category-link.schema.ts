import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductCategoryLinkComponent } from './category-link.component';

export const productCategoryLinkSchema: ContentComponentSchema<ProductCategoryLinkComponent> =
  {
    name: 'Product Category Link',
    group: 'Product',
    icon: IconTypes.Link,
    options: {
      category: {
        width: 100,
      },
    },
  };
