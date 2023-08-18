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
  getFieldByLocale,
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
      articles: data.data.items.map((entry) => {
        const id = getFieldByLocale(entry.fields.id, data.locale);

        return {
          id,
          heading: getFieldByLocale(entry.fields.heading, data.locale),
          description: getFieldByLocale(entry.fields.description, data.locale),
          content: getFieldByLocale(entry.fields.content, data.locale),
          url: `/${ContentfulContentFields.Article}/${encodeURIComponent(id)}`,
        };
      }),
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

    return this.cmsAdapter.get({ id: qualifier.id, type: qualifier.type }).pipe(
      map((data) => {
        console.log(data);
        return data?.articles ?? null;
      })
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
