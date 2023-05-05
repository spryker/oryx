import { componentDef } from '@spryker-oryx/core';

export const userProfileComponent = componentDef({
  name: 'oryx-picking-user-profile',
  impl: () =>
    import('./user-profile.component').then((m) => m.UserProfileComponent),
});
