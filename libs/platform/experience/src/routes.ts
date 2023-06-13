import { RouteConfig } from '@spryker-oryx/router/lit';
import { html, TemplateResult } from 'lit';
import 'urlpattern-polyfill';

export const defaultExperienceRoutes: RouteConfig[] = [
  {
    pattern: new URLPattern({ pathname: '/{index.html}?' }),
    render: (): TemplateResult =>
      html`<experience-composition route="/"></experience-composition>`,
    name: 'Home',
  },
  {
    path: '/product/:sku',
    render: (): TemplateResult => html`<experience-composition
      route="/product/:sku"
    ></experience-composition>`,
    name: 'Product test',
  },
  {
    path: '/category/:id',
    render: (): TemplateResult => html`<experience-composition
      route="/category/:id"
    ></experience-composition>`,
    name: 'Category test',
  },
  {
    path: '/order/:id',
    render: (): TemplateResult => html`<experience-composition
      route="/order/:id"
    ></experience-composition>`,
    name: 'Order',
  },
  {
    path: '/:page',
    render: ({ page }): TemplateResult => html`<experience-composition
      route="/${page}"
    ></experience-composition>`,
    name: 'Page',
  },
  {
    path: '/*',
    render: (): TemplateResult =>
      html`<oryx-heading><h1>Error 404</h1></oryx-heading>
        <p>Page not found</p>`,
    name: '404',
  },
];
