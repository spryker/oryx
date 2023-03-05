import { RouteConfig } from '@lit-labs/router';
import { html } from 'lit';

export const defaultBapiRoutes = (
  loginPath: string,
  callbackPath: string,
  providerId: string
): RouteConfig[] => [
  {
    path: loginPath,
    render: () => html`<oryx-auth-login></oryx-auth-login>`,
  },
  {
    path: callbackPath,
    render: () =>
      html`<oryx-oauth-handler providerId=${providerId}></oryx-oauth-handler>`,
  },
];
