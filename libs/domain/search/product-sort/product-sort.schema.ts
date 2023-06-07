import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { SearchProductSortComponent } from './product-sort.component';

export const searchProductSortSchema: ContentComponentSchema<SearchProductSortComponent> =
  {
    name: 'Product List Sort',
    group: 'Search',
    icon: IconTypes.Sort,
  };
