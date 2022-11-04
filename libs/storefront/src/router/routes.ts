import { RouteConfig } from '@lit-labs/router';
import { html, TemplateResult } from 'lit';
import 'urlpattern-polyfill';

export const routes: RouteConfig[] = [
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
    path: '/:page',
    render: ({ page }): TemplateResult => html`<experience-composition
      route="/${page}"
    ></experience-composition>`,
    name: 'Page',
  },
  {
    path: '/checkout',
    render: (): TemplateResult => html`<experience-composition
      route="/checkout"
    ></experience-composition>`,
    name: 'Checkout',
  },
  {
    path: '/*',
    render: (): TemplateResult =>
      html`<h1>Error 404</h1>
        <p>Page not found</p>`,
    name: '404',
  },
];
