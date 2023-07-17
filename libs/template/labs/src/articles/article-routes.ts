import { html, TemplateResult } from 'lit';
import { ContentfulContentFields } from './contentful';
import { StoryblokContentFields } from './storyblok';

export const articleRoutes = [
  {
    path: '/faq/:id',
    render: (): TemplateResult => html`<oryx-composition
      route="/faq/:id"
    ></oryx-composition>`,
    name: 'FAQ',
    type: StoryblokContentFields.Faq,
  },
  {
    path: '/article/:id',
    render: (): TemplateResult => html`<oryx-composition
      route="/article/:id"
    ></oryx-composition>`,
    name: 'Article',
    type: ContentfulContentFields.Article,
  },
];
