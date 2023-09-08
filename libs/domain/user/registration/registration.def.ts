import { componentDef } from '@spryker-oryx/utilities';

declare global {
  interface FeatureOptions {
    'oryx-auth-registration'?: RegistrationOptions;
  }
}

export const authRegistrationComponent = componentDef({
  name: 'oryx-user-registration',
  impl: () =>
    import('./registration.component').then((m) => m.UserRegistrationComponent),
  schema: () =>
    import('./registration.schema').then((m) => m.registrationComponentSchema),
});
