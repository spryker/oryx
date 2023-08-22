import {
  Content,
  ContentAdapter,
  ContentQualifier,
} from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import { CmsAdapter } from '@spryker-oryx/experience';
import { Observable, map, of } from 'rxjs';
import { ContentfulContentFields } from './contentful.model';

interface CmsArticle {
  heading: string;
  description: string;
  content: string;
}

export class ContentfulContentAdapter implements ContentAdapter {
  constructor(protected cmsAdapter = inject(CmsAdapter)) {}

  getKey(qualifier: ContentQualifier): string {
    return qualifier.id ?? '';
  }

  getAll(qualifier: ContentQualifier): Observable<Content[] | null> {
    if (qualifier.type !== ContentfulContentFields.Article) {
      return of(null);
    }

    return this.cmsAdapter
      .get<CmsArticle>({ id: qualifier.id, type: qualifier.type })
      .pipe(
        map((data) =>
          data.items.map((entry) => ({
            id: entry.id,
            heading: entry.heading,
            description: entry.description,
            content: entry.content,
            url: `/${ContentfulContentFields.Article}/${encodeURIComponent(
              entry.id
            )}`,
          }))
        )
      );
  }

  get(qualifier: ContentQualifier): Observable<Content | null> {
    return this.getAll(qualifier).pipe(
      map(
        (articles) =>
          articles?.find((entry) => entry.id === qualifier.id) ?? null
      )
    );
  }
}
