import { RouteConfig } from '@spryker-oryx/router/lit';
import { html } from 'lit';

export const defaultBapiRoutes = (
  loginPath: string,
  callbackPath: string,
  providerId: string
): RouteConfig[] => [
  {
    path: loginPath,
    render: () => html`<oryx-picking-login></oryx-picking-login>`,
  },
  {
    path: callbackPath,
    render: () =>
      html`<oryx-auth-oauth-handler
        providerId=${providerId}
      ></oryx-auth-oauth-handler>`,
  },
];
