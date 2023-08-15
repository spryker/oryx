import {
  Content,
  ContentAdapter,
  ContentQualifier,
} from '@spryker-oryx/content';
import {
  ApiExperienceCmsModel,
  CmsExperienceAdapter,
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
  data: ApiExperienceCmsModel.Model
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

export class ContentfulContentAdapter
  extends CmsExperienceAdapter<Content>
  implements ContentAdapter
{
  getAll(qualifier: ContentQualifier): Observable<Content[] | null> {
    if (qualifier.type !== ContentfulContentFields.Article) {
      return of(null);
    }

    return this.getCmsData(qualifier).pipe(
      map((data) => data?.articles ?? null)
    );
  }

  override get(qualifier: ContentQualifier): Observable<Content | null> {
    return this.getAll({ id: qualifier.id, type: qualifier.type }).pipe(
      map(
        (articles) =>
          articles?.find((entry) => entry.id === qualifier.id) ?? null
      )
    );
  }
}
