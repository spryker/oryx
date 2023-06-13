import { componentDef } from '@spryker-oryx/core';

export const userAddressRemoveComponent = componentDef({
  name: 'oryx-user-address-remove',
  impl: () =>
    import('./address-remove.component').then(
      (m) => m.UserAddressRemoveComponent
    ),
  stylesheets: [
    {
      rules: () =>
        import('./address-remove.styles').then((m) => m.screenStyles),
    },
  ],
});
