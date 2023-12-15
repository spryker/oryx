import {
  ContentContext,
  ContentQualifier,
  ContentService,
} from '@spryker-oryx/content';
import {
  ContextService,
  ElementResolver,
  PageMetaResolver,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { ArticleContent } from '../article.model';

export class ArticlePageDescriptionMetaResolver implements PageMetaResolver {
  constructor(
    protected context = inject(ContextService),
    protected content = inject(ContentService),
    protected router = inject(RouterService)
  ) {}

  getScore(): Observable<unknown[]> {
    return combineLatest([
      this.context.get(null, ContentContext.Qualifier),
      combineLatest([
        this.context.get(null, ContentContext.Qualifier),
        this.router.currentRoute(),
      ]).pipe(map(([type, route]) => route.includes(`/${type}/`))),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return this.context
      .get<ContentQualifier>(null, ContentContext.Qualifier)
      .pipe(
        switchMap((qualifier) => {
          const type = qualifier?.type;
          const id = qualifier?.id;

          if (!id || !type) return of({});

          return this.content
            .get<ArticleContent>({
              id,
              type,
              entities: [type],
            })
            .pipe(
              map((data) =>
                data?.description ? { description: data.description } : {}
              )
            );
        })
      );
  }
}
