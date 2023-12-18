import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { EntityImageComponent } from './entity-image.component';

export const entityImageSchema: ContentComponentSchema<EntityImageComponent> = {
  name: 'Entity text',
  group: 'Experience',
  icon: IconTypes.Image,
  options: {
    entity: { type: FormFieldType.Text },
    field: { type: FormFieldType.Text },
    renderFallback: { type: FormFieldType.Boolean },
  },
};
