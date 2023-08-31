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
import { CmsArticle } from '../article.model';
import { ContentfulContentFields } from '../contentful';
import { StoryblokContentFields } from '../storyblok';

export class ArticlePageTitleMetaResolver implements PageMetaResolver {
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
              route.includes(ContentfulContentFields.Article) ||
              route.includes(StoryblokContentFields.Faq)
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
          .get<CmsArticle>({
            id,
            type,
            entities: [
              ContentfulContentFields.Article,
              StoryblokContentFields.Faq,
            ],
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
