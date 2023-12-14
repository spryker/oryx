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
      this.context.get(null, ArticleContext.Id),
      this.context.get(null, ContentContext.Qualifier),
      combineLatest([
        this.context.get(null, ContentContext.Qualifier),
        this.router.currentRoute(),
      ]).pipe(map(([type, route]) => route.includes(`/${type}/`))),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return combineLatest([
      this.context.get<string>(null, ArticleContext.Id),
      this.context.get<ContentQualifier>(null, ContentContext.Qualifier),
    ]).pipe(
      switchMap(([id, content]) => {
        const type = content?.type;

        if (!id || !type) return of({});

        return this.content
          .get<ArticleContent>({
            id,
            type,
            entities: [type],
          })
          .pipe(map((data) => (data?.heading ? { title: data.heading } : {})));
      })
    );
  }
}
