import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductCategoryRelatedListComponent } from './category-related-list.component';

export const productCategoryRelatedListSchema: ContentComponentSchema<ProductCategoryRelatedListComponent> =
  {
    name: 'Product Category Related List',
    group: 'Product',
    icon: IconTypes.ViewList,
  };
