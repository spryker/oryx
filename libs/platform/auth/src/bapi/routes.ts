import { RouteConfig } from '@spryker-oryx/router/lit';
import { html } from 'lit';

export const defaultBapiRoutes = (
  loginPath: string,
  callbackPath: string,
  providerId: string
): RouteConfig[] => [
  {
    path: loginPath,
    render: () =>
      html`<oryx-composition uid="fulfillment-login-page"></oryx-composition>`,
  },
  {
    path: callbackPath,
    render: () =>
      html`<oryx-auth-oauth-handler
        providerId=${providerId}
      ></oryx-auth-oauth-handler>`,
  },
];
