import { componentDef } from '@spryker-oryx/core';

export const cartEntryOptionsComponent = componentDef({
  name: 'cart-entry-options',
  impl: () =>
    import('./options.component').then((m) => m.CartEntryOptionsComponent),
  stylesheets: [
    {
      rules: () =>
        import('./options.styles').then((m) => m.optionsScreenStyles),
    },
  ],
});
