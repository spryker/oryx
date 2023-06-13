import { RouteConfig } from '@spryker-oryx/router/lit';
import { html } from 'lit';

export const defaultBapiRoutes = (
  loginPath: string,
  callbackPath: string,
  providerId: string
): RouteConfig[] => [
  {
    path: loginPath,
    render: () => html`<oryx-login-page></oryx-login-page>`,
  },
  {
    path: callbackPath,
    render: () =>
      html`<oryx-oauth-handler providerId=${providerId}></oryx-oauth-handler>`,
  },
];
