import { ContentFields } from '@spryker-oryx/content';
import { RouteConfig } from '@spryker-oryx/router/lit';

export const articleRoutes: RouteConfig[] = [
  {
    path: '/faq/:id',
    type: ContentFields.Faq,
  },
  {
    path: '/article/:id',
    type: ContentFields.Article,
  },
];
