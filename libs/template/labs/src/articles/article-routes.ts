import { html, TemplateResult } from 'lit';

export const articleRoutes = [
  {
    path: '/faq',
    render: (): TemplateResult => html`<oryx-composition
      route="/faq"
    ></oryx-composition>`,
    name: 'FAQs',
  },
  {
    path: '/faq/:id',
    render: (): TemplateResult => html`<oryx-composition
      route="/faq/:id"
    ></oryx-composition>`,
    name: 'FAQ',
  },
  {
    path: '/article',
    render: (): TemplateResult => html`<oryx-composition
      route="/article"
    ></oryx-composition>`,
    name: 'Articles',
  },
  {
    path: '/article/:id',
    render: (): TemplateResult => html`<oryx-composition
      route="/article/:id"
    ></oryx-composition>`,
    name: 'Article',
  },
];
