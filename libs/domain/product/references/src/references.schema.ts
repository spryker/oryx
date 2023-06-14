import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ReferencesComponent } from './references.component';

export const referencesSchema: ContentComponentSchema<ReferencesComponent> = {
  name: 'Product References',
  group: 'Product',
  icon: IconTypes.ViewList,
};
