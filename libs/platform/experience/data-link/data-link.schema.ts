import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { DataLinkComponent } from './data-link.component';

export const dataLinkSchema: ContentComponentSchema<DataLinkComponent> = {
  name: 'Data link',
  group: 'Experience',
  icon: IconTypes.Link,
  options: {
    field: { type: FormFieldType.Text },
    entity: { type: FormFieldType.Text },
  },
};
