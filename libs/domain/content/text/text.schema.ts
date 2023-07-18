import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from 'libs/platform/form/src';
import { ContentTextComponent } from './text.component';

export const contentTextSchema: ContentComponentSchema<ContentTextComponent> = {
  name: 'Text',
  group: 'Content',
  icon: 'wysiwyg',
  options: { autoInstallFont: { type: FormFieldType.Boolean } },
  content: { text: { type: FormFieldType.Text } },
};
