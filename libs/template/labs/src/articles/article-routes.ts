import { ContentFields } from '@spryker-oryx/content';
import { RouteConfig } from '@spryker-oryx/router/lit';

export const articleRoutes: RouteConfig[] = [
  {
    path: '/faq/:id',
    type: ContentFields.Faq,
    // TODO: uncomment when performance issue will be solved
    // enter: ({ id }) =>
    //   resolve(ContentService)
    //     .get({
    //       id,
    //       type: ContentFields.Faq,
    //       entities: [ContentFields.Faq],
    //     })
    //     .pipe(
    //       take(1),
    //       map((faq) => (faq ? true : RouteType.NotFound))
    //     ),
  },
  {
    path: '/article/:id',
    type: ContentFields.Article,
    // TODO: uncomment when performance issue will be solved
    // enter: ({ id }) =>
    //   resolve(ContentService)
    //     .get({
    //       id,
    //       type: ContentFields.Article,
    //       entities: [ContentFields.Article],
    //     })
    //     .pipe(
    //       take(1),
    //       map((article) => {
    //         return article ? true : RouteType.NotFound;
    //       })
    //     ),
  },
];
