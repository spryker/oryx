import { componentDef } from '@spryker-oryx/core';

export * from './error-message.component';
export * from './error-message.styles';

export const errorMessageComponent = componentDef({
  name: 'oryx-error-message',
  impl: () =>
    import('./error-message.component').then((m) => m.ErrorMessageComponent),
});
