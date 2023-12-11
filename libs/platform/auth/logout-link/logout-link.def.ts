import { componentDef } from '@spryker-oryx/utilities';
import { LogoutLinkOptions } from './logout-link.model';

declare global {
  interface FeatureOptions {
    'oryx-auth-logout-link'?: LogoutLinkOptions;
  }
}

export const logoutLinkComponent = componentDef({
  name: 'oryx-auth-logout-link',
  impl: () =>
    import('./logout-link.component').then((m) => m.LogoutLinkComponent),
  schema: () =>
    import('./logout-link.schema').then((m) => m.logoutLinkComponentSchema),
});
