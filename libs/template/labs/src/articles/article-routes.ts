import { ContentFields, ContentService } from '@spryker-oryx/content';
import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { map, take } from 'rxjs';

export const articleRoutes: RouteConfig[] = [
  {
    path: '/faq/:id',
    type: ContentFields.Faq,
    enter: ({ id }) =>
      resolve(ContentService)
        .get({
          id,
          type: ContentFields.Faq,
          entities: [ContentFields.Faq],
        })
        .pipe(
          take(1),
          map((faq) => (faq ? true : RouteType.NotFound))
        ),
  },
  {
    path: '/article/:id',
    type: ContentFields.Article,
    enter: ({ id }) =>
      resolve(ContentService)
        .get({
          id,
          type: ContentFields.Article,
          entities: [ContentFields.Article],
        })
        .pipe(
          take(1),
          map((article) => {
            return article ? true : RouteType.NotFound;
          })
        ),
  },
];
