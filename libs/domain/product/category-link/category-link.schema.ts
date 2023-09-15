import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductCategoryLinkComponent } from './category-link.component';

export const productCategoryLinkSchema: ContentComponentSchema<ProductCategoryLinkComponent> =
  {
    name: 'Product title',
    group: 'Product',
    icon: IconTypes.Title,
    options: {
      category: {
        width: 100,
      },
    },
  };
