import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { CompositionComponent } from './composition.component';

export const ContentSuggestionFieldType = 'ContentSuggestion';

export interface ContentSuggestionFieldOptions {
  [ContentSuggestionFieldType]: unknown;
}

export const compositionSchema: ContentComponentSchema<
  CompositionComponent,
  { context: unknown }
> = {
  name: 'Composition',
  group: 'Experience',
  icon: 'dashboard_customize',
  options: {
    bucket: {
      type: FormFieldType.Boolean,
      width: 100,
      label: 'Composition Bucket',
    },
    bucketType: {
      type: FormFieldType.Select,
      width: 100,
      label: 'Show Bucket Type',
      options: [
        { value: 'label', text: 'Label' },
        { value: 'main', text: 'Main' },
      ],
    },
    context: {
      type: ContentSuggestionFieldType,
      width: 100,
      label: 'Composition Context',
    },
  },
};
