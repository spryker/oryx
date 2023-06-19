import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductReferencesComponent } from './relations.component';

export const relationsSchema: ContentComponentSchema<ProductReferencesComponent> =
  {
    name: 'Product References',
    group: 'Product',
    icon: IconTypes.ViewList,
  };
