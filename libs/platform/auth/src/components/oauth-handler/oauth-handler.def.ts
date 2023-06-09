import { componentDef } from '@spryker-oryx/core';

export const oauthHandlerComponent = componentDef({
  name: 'oryx-oauth-handler',
  impl: () => import('./oauth-handler.component').then((m) => m.default),
});
