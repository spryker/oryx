import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { EntityTextComponent } from './entity-text.component';

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
