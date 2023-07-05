import { RouteConfig } from '@lit-labs/router';
import { html, TemplateResult } from 'lit';

export const articleRoutes: RouteConfig[] = [
  {
    path: '/faq',
    render: (): TemplateResult => html`<oryx-composition
      route="/faq"
    ></oryx-composition>`,
    name: 'FAQ',
  },
  {
    path: '/faq/:id',
    render: (): TemplateResult => html`<oryx-composition
      route="/faq/:id"
    ></oryx-composition>`,
    name: 'FAQ',
  },
  {
    path: '/article/:id',
    render: (): TemplateResult => html`<oryx-composition
      route="/article/:id"
    ></oryx-composition>`,
    name: 'Article',
  },
];
