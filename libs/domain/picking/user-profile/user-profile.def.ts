import { componentDef } from '@spryker-oryx/utilities';

export const userProfileComponent = componentDef({
  name: 'oryx-picking-user-profile',
  impl: () =>
    import('./user-profile.component').then((m) => m.UserProfileComponent),
});
