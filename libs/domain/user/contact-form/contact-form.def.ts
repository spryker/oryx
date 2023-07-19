import { componentDef } from '@spryker-oryx/utilities';

export const userContactFormComponent = componentDef({
  name: 'user-contact-form',
  impl: () =>
    import('./contact-form.component').then((m) => m.UserContactFormComponent),
});
