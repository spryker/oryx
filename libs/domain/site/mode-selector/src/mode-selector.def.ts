import { componentDef } from '@spryker-oryx/core';

export const siteModeSelectorComponent = componentDef({
  name: 'oryx-site-mode-selector',
  impl: () =>
    import('./mode-selector.component').then(
      (m) => m.SiteModeSelectorComponent
    ),
  schema: () =>
    import('./mode-selector.schema').then((m) => m.siteModeSelectorSchema),
});
