import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { EntityLinkComponent } from './entity-link.component';

export const dataLinkSchema: ContentComponentSchema<EntityLinkComponent> = {
  name: 'Data text',
  group: 'Experience',
  icon: IconTypes.Link,
  options: {
    entity: { type: FormFieldType.Text },
    field: { type: FormFieldType.Text },
  },
};
