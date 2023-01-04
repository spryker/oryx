import { componentDef } from '@spryker-oryx/core';

export const contactFormComponent = componentDef({
  name: 'user-contact-form',
  impl: () =>
    import('./contact-form.component').then((m) => m.ContactFormComponent),
});
