import { ContentComponentSchema } from '@spryker-oryx/experience';
import { EntityTextComponent } from './entity-text.component';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';

export const entityTextSchema: ContentComponentSchema<EntityTextComponent> = {
  name: 'Entity text',
  group: 'Experience',
  icon: IconTypes.Edit,
  options: {
    entity: {
      type: FormFieldType.Text,
    },
    field: {
      type: FormFieldType.Text,
    },
  },
};
