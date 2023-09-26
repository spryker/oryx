import { componentDef } from '@spryker-oryx/utilities';

declare global {
  interface FeatureOptions {
    'oryx-user-registration'?: RegistrationOptions;
  }
}

export const userRegistrationComponent = componentDef({
  name: 'oryx-user-registration',
  impl: () =>
    import('./registration.component').then((m) => m.UserRegistrationComponent),
  schema: () =>
    import('./registration.schema').then((m) => m.registrationComponentSchema),
  stylesheets: [
    {
      rules: () => import('./registration.styles').then((m) => m.screenStyles),
    },
  ],
});
