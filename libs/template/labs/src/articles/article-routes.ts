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
        .get({
          id,
          type: StoryblokContentFields.Faq,
          entities: [StoryblokContentFields.Faq],
        })
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
        .get({
          id,
          type: ContentfulContentFields.Article,
          entities: [ContentfulContentFields.Article],
        })
        .pipe(
          take(1),
          map((article) => {
            console.log(article);
            return article ? true : RouteType.NotFound;
          })
        ),
  },
];
