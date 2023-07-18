import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { html, TemplateResult } from 'lit';
import 'urlpattern-polyfill';

export const defaultExperienceRoutes: RouteConfig[] = [
  {
    pattern: new URLPattern({ pathname: '/{index.html}?' }),
  },
  {
    path: '/product/:sku',
    type: RouteType.Product,
  },
  {
    path: '/category/:id',
    type: RouteType.Category,
  },
  {
    path: '/order/:id',
    type: RouteType.Order,
  },
  {
    path: '/:page',
    type: RouteType.Page,
  },
  {
    path: '/*',
    render: (): TemplateResult =>
      html`<oryx-heading><h1>Error 404</h1></oryx-heading>
        <p>Page not found</p>`,
  },
];
