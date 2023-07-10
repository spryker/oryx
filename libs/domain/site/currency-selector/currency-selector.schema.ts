import { ContentComponentSchema } from '@spryker-oryx/experience';
import { SiteCurrencySelectorComponent } from './currency-selector.component';

export const siteCurrencySelectorSchema: ContentComponentSchema<SiteCurrencySelectorComponent> =
  {
    name: 'Currency selector',
    group: 'Site',
    icon: 'euro',
  };
