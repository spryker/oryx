import { ContentComponentSchema } from '@spryker-oryx/experience';
import { SiteLocaleSelectorComponent } from './locale-selector.component';

export const localeSelectorSchema: ContentComponentSchema<SiteLocaleSelectorComponent> =
  {
    name: 'Locale selector',
    group: 'Site',
    options: {},
  };
