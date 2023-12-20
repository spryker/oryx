import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { EntityLinkComponent } from './entity-link.component';

export const entityLinkSchema: ContentComponentSchema<EntityLinkComponent> = {
  name: 'Entity text',
  group: 'Experience',
  icon: IconTypes.Link,
  options: {
    entity: {
      type: FormFieldType.Text,
    },
    field: {
      type: FormFieldType.Text,
    },
  },
};
