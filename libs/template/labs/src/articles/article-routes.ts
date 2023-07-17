import { ContentfulContentFields } from './contentful';
import { StoryblokContentFields } from './storyblok';
import { RouteConfig } from '@spryker-oryx/router/lit';

export const articleRoutes: RouteConfig[] = [
  {
    path: '/faq/:id',
    type: StoryblokContentFields.Faq,
  },
  {
    path: '/article/:id',
    type: ContentfulContentFields.Article,
  },
];
