import { componentDef } from '@spryker-oryx/core';

export const siteLocaleSelectorComponent = componentDef({
  name: 'oryx-site-locale-selector',
  impl: () =>
    import('./locale-selector.component').then(
      (m) => m.SiteLocaleSelectorComponent
    ),
  schema: import('./locale-selector.schema').then(
    (m) => m.siteLocaleSelectorSchema
  ),
});
