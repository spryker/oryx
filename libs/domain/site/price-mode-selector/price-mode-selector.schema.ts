import { ContentComponentSchema } from '@spryker-oryx/experience';
import { SitePriceModeSelectorComponent } from './price-mode-selector.component';

export const sitePriceModeSelectorSchema: ContentComponentSchema<SitePriceModeSelectorComponent> =
  {
    name: 'Price mode selector',
    group: 'Site',
    icon: 'euro',
  };
