import { ContentService } from '@spryker-oryx/content';
import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { map, take } from 'rxjs';
import { ContentfulContentFields } from './contentful';
import { StoryblokContentFields } from './storyblok';

export const articleRoutes: RouteConfig[] = [
  {
    path: '/faq/:id',
    type: StoryblokContentFields.Faq,
    enter: ({ id }) =>
      resolve(ContentService)
        .get({ id, type: 'faq' })
        .pipe(
          take(1),
          map((faq) => (faq ? true : RouteType.NotFound))
        ),
  },
  {
    path: '/article/:id',
    type: ContentfulContentFields.Article,
    enter: ({ id }) =>
      resolve(ContentService)
        .get({ id, type: 'article' })
        .pipe(
          take(1),
          map((article) => (article ? true : RouteType.NotFound))
        ),
  },
];
