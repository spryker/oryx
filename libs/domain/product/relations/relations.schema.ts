import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductRelationsComponent } from './relations.component';

export const relationsSchema: ContentComponentSchema<ProductRelationsComponent> =
  {
    name: 'Product Relations',
    group: 'Product',
    icon: IconTypes.ViewList,
  };
