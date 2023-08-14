import { TokenResolver } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { html, TemplateResult } from 'lit';
import { map, take } from 'rxjs';
import 'urlpattern-polyfill';

export const defaultExperienceLatestRoutes: RouteConfig[] = [
  {
    pattern: new URLPattern({ pathname: '/{index.html}?' }),
  },
  {
    path: '/login',
    type: RouteType.Login,
    enter: () =>
      resolve(TokenResolver)
        .resolveToken('USER.AUTHENTICATED')
        .pipe(
          take(1),
          map((state) => (state ? '/' : !state))
        ),
  },
  {
    path: '/:page',
    type: RouteType.Page,
  },
  {
    path: '/*',
    type: RouteType.NotFound,
    render: (): TemplateResult =>
      html`<oryx-heading><h1>Error 404</h1></oryx-heading>
        <p>Page not found</p>`,
  },
];

export const defaultExperienceRoutes: RouteConfig[] = [
  ...defaultExperienceLatestRoutes,
  {
    path: '/product/:sku',
    type: RouteType.Product,
  },
  {
    path: '/category/:id',
    type: RouteType.Category,
  },
];
