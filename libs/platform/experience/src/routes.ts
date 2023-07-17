import { RouteConfig, RouteLinkType } from '@spryker-oryx/router/lit';
import { html, TemplateResult } from 'lit';
import 'urlpattern-polyfill';

export const defaultExperienceRoutes: RouteConfig[] = [
  {
    pattern: new URLPattern({ pathname: '/{index.html}?' }),
    render: (): TemplateResult =>
      html`<oryx-composition route="/"></oryx-composition>`,
    name: 'Home',
  },
  {
    path: '/product/:sku',
    render: (): TemplateResult => html`<oryx-composition
      route="/product/:sku"
    ></oryx-composition>`,
    name: 'Product test',
    type: RouteLinkType.Product,
  },
  {
    path: '/category/:id',
    render: (): TemplateResult => html`<oryx-composition
      route="/category/:id"
    ></oryx-composition>`,
    name: 'Category test',
    type: RouteLinkType.Category,
  },
  {
    path: '/order/:id',
    render: (): TemplateResult => html`<oryx-composition
      route="/order/:id"
    ></oryx-composition>`,
    name: 'Order',
    type: RouteLinkType.Order,
  },
  {
    path: '/my-account/addresses/edit/:id',
    render: (): TemplateResult => html`<oryx-composition
      route="/my-account/addresses/edit/:id"
    ></oryx-composition>`,
    name: 'Address Book Edit',
    type: RouteLinkType.AddressBookEdit,
  },
  {
    path: '/:page',
    render: ({ page }): TemplateResult => html`<oryx-composition
      route="/${page}"
    ></oryx-composition>`,
    name: 'Page',
    type: RouteLinkType.Page,
  },
  {
    path: '/*',
    render: (): TemplateResult =>
      html`<oryx-heading><h1>Error 404</h1></oryx-heading>
        <p>Page not found</p>`,
    name: '404',
  },
];
