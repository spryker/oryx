import { ContentComponentSchema } from '@spryker-oryx/experience';
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
    context: {
      type: ContentSuggestionFieldType,
      width: 100,
      label: 'Composition Context',
    },
  },
};
