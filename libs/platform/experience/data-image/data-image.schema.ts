import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { DataImageComponent } from './data-image.component';

export const dataImageSchema: ContentComponentSchema<DataImageComponent> = {
  name: 'Data Image',
  group: 'Experience',
  icon: IconTypes.Image,
  options: {
    field: { type: FormFieldType.Text },
    entity: { type: FormFieldType.Text },
    renderFallback: { type: FormFieldType.Boolean, width: 100 },
  },
};
