import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductReferencesComponent } from './references.component';

export const referencesSchema: ContentComponentSchema<ProductReferencesComponent> =
  {
    name: 'Product References',
    group: 'Product',
    icon: IconTypes.ViewList,
  };
