import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ListComponent } from './list.component';

export const listSchema: ContentComponentSchema<ListComponent> = {
  name: 'List',
  group: 'Content',
  icon: IconTypes.List,
  options: {
    query: { type: FormFieldType.Text },
    tags: { type: FormFieldType.Text },
    type: { type: FormFieldType.Text },
  },
};
