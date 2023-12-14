import { ContentContext } from '@spryker-oryx/content';
import { ContextFallback } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { combineLatest, map } from 'rxjs';

export const ArticleQualifierContextFallback: Provider = {
  provide: `${ContextFallback}${ContentContext.Qualifier}`,
  useFactory: () =>
    combineLatest([
      inject(RouterService).currentRoute(),
      inject(RouterService).currentParams(),
    ]).pipe(
      map(([route, params]) => ({
        id: params?.id,
        type: route.split('/').filter(Boolean)[0],
      }))
    ),
};
