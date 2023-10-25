import { ContentComponentSchema } from '@spryker-oryx/experience';
import { SiteLocaleSelectorComponent } from './locale-selector.component';

export const siteLocaleSelectorSchema: ContentComponentSchema<SiteLocaleSelectorComponent> =
  {
    name: 'Locale selector',
    group: 'Site',
    icon: 'language',
    options: {
      enableFlag: { type: 'boolean' },
    },
  };
