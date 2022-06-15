import { RouteConfig } from '@lit-labs/router';
import { html, TemplateResult } from 'lit';

export const routes: RouteConfig[] = [
  {
    pattern: new URLPattern({ pathname: '/{index.html}?' }),
    render: (): TemplateResult =>
      html`<experience-composition key="/"></experience-composition>`,
    name: 'Home',
  },
  {
    path: '/product/:sku',
    render: (): TemplateResult => html`<experience-composition
      key="/product/:sku"
    ></experience-composition>`,
    name: 'Product test',
  },
  {
    path: '/:page',
    render: ({ page }): TemplateResult => html`<experience-composition
      key="/${page}"
    ></experience-composition>`,
    name: 'Page',
  },
];
