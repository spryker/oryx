import { ContextServiceFallback } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map } from 'rxjs';

export const enum ArticleContext {
  Id = 'article-id',
  Type = 'article-type',
}

export const ArticleIdContextFallback: Provider = {
  provide: `${ContextServiceFallback}${ArticleContext.Id}`,
  useFactory: () =>
    inject(RouterService)
      .currentParams()
      .pipe(map((params) => params?.id)),
};

export const ArticleTypeContextFallback: Provider = {
  provide: `${ContextServiceFallback}${ArticleContext.Type}`,
  useFactory: () =>
    inject(RouterService)
      .currentRoute()
      .pipe(map((route) => route.split('/').filter(Boolean)[0])),
};
