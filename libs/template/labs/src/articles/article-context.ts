import { ContentContext } from '@spryker-oryx/content';
import { ContextFallback } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map } from 'rxjs';

export const enum ArticleContext {
  Id = 'article-id',
}

export const ArticleIdContextFallback: Provider = {
  provide: `${ContextFallback}${ArticleContext.Id}`,
  useFactory: () =>
    inject(RouterService)
      .currentParams()
      .pipe(map((params) => params?.id)),
};

export const ArticleTypeContextFallback: Provider = {
  provide: `${ContextFallback}${ContentContext.Qualifier}`,
  useFactory: () =>
    inject(RouterService)
      .currentRoute()
      .pipe(map((route) => ({ type: route.split('/').filter(Boolean)[0] }))),
};
