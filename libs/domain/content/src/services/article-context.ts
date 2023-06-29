import { ContextServiceFallback } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map } from 'rxjs';

export const enum ArticleContext {
  Id = 'id',
}

export const ArticleContextFallback: Provider = {
  provide: `${ContextServiceFallback}${ArticleContext.Id}`,
  useFactory: () =>
    inject(RouterService)
      .currentParams()
      .pipe(map((params) => params?.id)),
};
