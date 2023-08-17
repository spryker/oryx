import {
  Content,
  ContentAdapter,
  ContentQualifier,
} from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import {
  ApiCmsModel,
  CmsAdapter,
  ExperienceCms,
} from '@spryker-oryx/experience';
import { Observable, map, of } from 'rxjs';
import { ContentfulContentFields } from './contentful.model';

declare module '@spryker-oryx/experience' {
  interface ExperienceCms {
    articles?: Content[];
  }
}

export function cmsContentNormalizer(
  data: ApiCmsModel.Model<{
    heading: string;
    description: string;
    content: string;
  }>
): ExperienceCms {
  if (data.qualifier.type === ContentfulContentFields.Article) {
    return {
      articles: data.data.items.map((entry) => ({
        id: entry.fields.id,
        heading: entry.fields.heading,
        description: entry.fields.description,
        content: entry.fields.content,
        url: `/${ContentfulContentFields.Article}/${encodeURIComponent(
          entry.fields.id
        )}`,
      })),
    };
  }

  return {};
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
      .get(qualifier)
      .pipe(map((data) => data?.articles ?? null));
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
