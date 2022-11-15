import { componentDef } from '@spryker-oryx/core';

export const cartEntryContentComponent = componentDef({
  name: 'cart-entry-content',
  impl: () =>
    import('./content.component').then((m) => m.CartEntryContentComponent),
  stylesheets: [
    {
      rules: () =>
        import('./content.styles').then((m) => m.contentScreenStyles),
    },
  ],
});
