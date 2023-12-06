import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductCategoryListComponent } from './list.component';

export const productCategoryListSchema: ContentComponentSchema<ProductCategoryListComponent> =
  {
    name: 'Product Category List',
    group: 'Product',
    icon: IconTypes.ViewList,
    options: {},
  };
