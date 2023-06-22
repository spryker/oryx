import { componentDef } from '@spryker-oryx/core';

export const articleComponent = componentDef({
  name: 'oryx-content-article',
  impl: () => import('./article.component').then((m) => m.ArticleComponent),
  schema: () => import('./article.schema').then((m) => m.articleSchema),
});
