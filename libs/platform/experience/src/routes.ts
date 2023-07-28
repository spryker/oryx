import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { html, TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import 'urlpattern-polyfill';

export const defaultExperienceRoutes: RouteConfig[] = [
  {
    pattern: new URLPattern({ pathname: '/{index.html}?' }),
  },
  {
    path: '/login',
    type: RouteType.Login,
    enter: (): Observable<boolean> =>
      resolve(AuthService).isAuthenticated(),
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
