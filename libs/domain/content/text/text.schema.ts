import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { ContentTextComponent } from './text.component';

export const contentTextSchema: ContentComponentSchema<ContentTextComponent> = {
  name: 'Text',
  group: 'Content',
  icon: 'wysiwyg',
  options: { autoInstallFont: { type: FormFieldType.Boolean } },
  content: { text: { type: FormFieldType.Text } },
};
