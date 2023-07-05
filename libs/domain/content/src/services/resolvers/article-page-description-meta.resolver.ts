import {
  ContextService,
  ElementResolver,
  PageMetaResolver,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { ArticleContext } from '../article-context';
import { ContentFields, ContentService } from '../content.service';

export class ArticlePageDescriptionMetaResolver implements PageMetaResolver {
  constructor(
    protected context = inject(ContextService),
    protected router = inject(RouterService),
    protected contentService = inject(ContentService)
  ) {}

  getScore(): Observable<unknown[]> {
    return combineLatest([
      this.context.get(document.body, ArticleContext.Id),
      this.context.get(document.body, ArticleContext.Type),
      this.router
        .currentRoute()
        .pipe(
          map(
            (route) =>
              route.includes(ContentFields.Article) ||
              route.includes(ContentFields.Faq)
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
        if (!id || !type) {
          return of({});
        }

        return this.contentService
          .get({
            id,
            type,
            entities: [ContentFields.Article, ContentFields.Faq],
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
