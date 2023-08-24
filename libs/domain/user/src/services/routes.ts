import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { html, TemplateResult } from 'lit';

export const userRoutes: RouteConfig[] = [
  {
    path: '/account/:page',
    type: RouteType.Account,
  },
  {
    path: '/account/*',
    type: RouteType.NotFound,
    render: (): TemplateResult =>
      html`<oryx-composition route="/account/:page"></oryx-composition>`,
  },
];
