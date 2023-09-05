import { ContentService } from '@spryker-oryx/content';
import {
  ContextService,
  ElementResolver,
  PageMetaResolver,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { ArticleContext } from '../article-context';
import { ArticleContent } from '../article.model';

export class ArticlePageTitleMetaResolver implements PageMetaResolver {
  constructor(
    protected context = inject(ContextService),
    protected router = inject(RouterService),
    protected content = inject(ContentService)
  ) {}

  getScore(): Observable<unknown[]> {
    return combineLatest([
      this.context.get(document.body, ArticleContext.Id),
      this.context.get(document.body, ArticleContext.Type),
      this.context
        .get(document.body, ArticleContext.Type)
        .pipe(
          switchMap((type) =>
            this.router
              .currentRoute()
              .pipe(map((route) => route.includes(`/${type}/`)))
          )
        ),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return combineLatest([
      this.context.get<string>(document.body, ArticleContext.Id),
      this.context.get<string>(document.body, ArticleContext.Type),
    ]).pipe(
      switchMap(([id, type]) => {
        if (!id || !type) return of({});

        return this.content
          .get<ArticleContent>({
            id,
            type,
            entities: [type],
          })
          .pipe(
            map((data) =>
              data?.fields.heading ? { title: data.fields.heading } : {}
            )
          );
      })
    );
  }
}
