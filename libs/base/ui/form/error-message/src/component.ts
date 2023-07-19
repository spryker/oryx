import { componentDef } from '@spryker-oryx/utilities';

export const errorMessageComponent = componentDef({
  name: 'oryx-error-message',
  impl: () =>
    import('./error-message.component').then((m) => m.ErrorMessageComponent),
});
