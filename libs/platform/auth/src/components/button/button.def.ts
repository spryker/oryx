import { componentDef } from '@spryker-oryx/core';
import { AuthButtonOptions } from './button.model';

declare global {
  interface FeatureOptions {
    'oryx-auth-button'?: AuthButtonOptions;
  }
}

export const authButtonComponent = componentDef({
  name: 'oryx-auth-button',
  impl: () => import('./button.component').then((m) => m.AuthButtonComponent),
  schema: () =>
    import('./button.schema').then((m) => m.authButtonComponentSchema),
});
