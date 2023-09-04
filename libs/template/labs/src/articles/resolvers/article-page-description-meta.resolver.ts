import { ContentService } from '@spryker-oryx/content';
import {
  ContextService,
  ElementResolver,
  PageMetaResolver,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { ArticleContext } from '../article-context';
import { ArticleContent } from '../article.model';

export class ArticlePageDescriptionMetaResolver implements PageMetaResolver {
  constructor(
    protected context = inject(ContextService),
    protected content = inject(ContentService)
  ) {}

  getScore(): Observable<unknown[]> {
    return combineLatest([
      this.context.get(document.body, ArticleContext.Id),
      this.context.get(document.body, ArticleContext.Type),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return combineLatest([
      this.context.get<string>(document.body, ArticleContext.Id),
      this.context.get<string>(document.body, ArticleContext.Type),
    ]).pipe(
      switchMap(([id, type]) => {
        return this.content
          .get<ArticleContent>({
            id,
            type,
            entities: [type],
          })
          .pipe(
            map((data) =>
              data?.fields?.description
                ? { description: data.fields.description }
                : {}
            )
          );
      })
    );
  }
}
