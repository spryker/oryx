import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { SortComponent } from './sort.component';

export const sortSchema: ContentComponentSchema<SortComponent> = {
  name: 'Product List Sort',
  group: 'Search',
  icon: IconTypes.Sort,
};
