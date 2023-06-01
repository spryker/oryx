import { componentDef } from '@spryker-oryx/core';

export const addressRemoveComponent = componentDef({
  name: 'oryx-user-address-remove',
  impl: () =>
    import('./address-remove.component').then((m) => m.AddressRemoveComponent),
  stylesheets: [
    {
      rules: () =>
        import('./address-remove.styles').then((m) => m.screenStyles),
    },
  ],
});
