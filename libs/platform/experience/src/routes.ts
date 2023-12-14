import { TokenResolver } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { featureVersion } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { map, take } from 'rxjs';
import 'urlpattern-polyfill';
import { ExperienceService } from './services';

export const defaultExperienceRoutes: RouteConfig[] = [
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
  ...(featureVersion < '1.1'
    ? [
        // deprecated routes in 1.1
        {
          path: '/search',
          type: RouteType.ProductList,
        },
        {
          path: '/product/:sku',
          type: RouteType.Product,
        },
        {
          path: '/category/:id',
          type: RouteType.Category,
        },
      ]
    : []),
  {
    path: featureVersion >= '1.4' ? '/*' : '/:page',
    type: RouteType.Page,
    ...(featureVersion >= '1.3'
      ? {
          afterEnter: (params) =>
            resolve(ExperienceService)
              .getComponent({
                route: `/${featureVersion >= '1.4' ? params[0] : params.page}`,
              })
              .pipe(
                take(1),
                map((component) => (component.id ? void 0 : RouteType.NotFound))
              ),
        }
      : {
          enter: (params) =>
            resolve(ExperienceService)
              .getComponent({
                route: `/${featureVersion >= '1.4' ? params[0] : params.page}`,
              })
              .pipe(
                take(1),
                map((component) => (component.id ? true : RouteType.NotFound))
              ),
        }),
  },
  {
    path: featureVersion >= '1.4' ? '404' : '/*',
    type: RouteType.NotFound,
    render: (): TemplateResult =>
      html`<oryx-heading><h1>Error 404</h1></oryx-heading>
        <p>Page not found</p>`,
  },
];
