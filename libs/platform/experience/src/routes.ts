import { RouteConfig } from '@lit-labs/router';
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
    path: '/login',
    render: (): TemplateResult => html`<experience-composition
      route="/login"
    ></experience-composition>`,
  },
  {
    path: '/cart',
    render: (): TemplateResult => html`<experience-composition
      route="/cart"
    ></experience-composition>`,
  },
  {
    path: '/checkout',
    render: (): TemplateResult => html`<experience-composition
      route="/checkout"
    ></experience-composition>`,
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
    path: '/:child1',
    render: ({ child }): TemplateResult => html`<experience-composition
      route="/${child}"
    ></experience-composition>`,
    name: 'Page',
  },
  {
    path: '/:child1/:child2',
    render: ({ child1, child2 }): TemplateResult => html`<experience-composition
      route="/${child1}/${child2}"
    ></experience-composition>`,
  },
  {
    path: '/:child1/:child2/:child3',
    render: ({
      child1,
      child2,
      child3,
    }): TemplateResult => html`<experience-composition
      route="/${child1}/${child2}/${child3}"
    ></experience-composition>`,
  },
  {
    path: '/:child1/:child2/:child3/:addressId',
    render: ({
      child1,
      child2,
      child3,
    }): TemplateResult => html`<experience-composition
      route="/${child1}/${child2}/${child3}/:id"
    ></experience-composition>`,
  },
  {
    path: '/*',
    render: (): TemplateResult =>
      html`<oryx-heading><h1>Error 404</h1></oryx-heading>
        <p>Page not found</p>`,
    name: '404',
  },
];
