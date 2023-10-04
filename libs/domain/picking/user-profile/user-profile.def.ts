import { componentDef } from '@spryker-oryx/utilities';

export const pickingUserProfileComponent = componentDef({
  name: 'oryx-picking-user-profile',
  impl: () =>
    import('./user-profile.component').then(
      (m) => m.PickingUserProfileComponent
    ),
});
