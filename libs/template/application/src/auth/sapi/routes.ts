import { RouteConfig } from '@lit-labs/router';
import { html } from 'lit';

export const defaultSapiRoutes = (loginPath: string): RouteConfig[] => [
  {
    path: loginPath,
    render: () => html`<oryx-auth-login></oryx-auth-login>`,
  },
];
