import { inject } from '@spryker-oryx/di';
import {
  ApiCmsModel,
  CmsAdapter,
  ExperienceCms,
  getFieldByLocale,
} from '@spryker-oryx/experience';
import {
  Suggestion,
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { Observable, map, of } from 'rxjs';
import { ContentfulContentFields } from './contentful.model';

declare module '@spryker-oryx/experience' {
  interface ExperienceCms {
    [SuggestionField.Contents]?: Suggestion[SuggestionField.Contents];
  }
}

export function cmsSuggestionNormalizer(
  data: ApiCmsModel.Model<{ heading: string }>
): ExperienceCms {
  if (data.qualifier.type === ContentfulContentFields.Article) {
    return {
      [SuggestionField.Contents]: data.data.items.map((entry) => ({
        name: getFieldByLocale(entry.fields.heading, data.locale),
        id: getFieldByLocale(entry.fields.id, data.locale),
        type: ContentfulContentFields.Article,
      })),
    };
  }

  return {};
}

export class DefaultContentfulSuggestionAdapter implements SuggestionAdapter {
  constructor(protected cmsAdapter = inject(CmsAdapter)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query, entities }: SuggestionQualifier): Observable<Suggestion> {
    if (
      entities?.includes(SuggestionField.Contents) ||
      entities?.includes(ContentfulContentFields.Article)
    ) {
      return this.cmsAdapter
        .get({
          query: this.getKey({ query }),
          type: ContentfulContentFields.Article,
        })
        .pipe(
          map((data) => ({
            [SuggestionField.Contents]: data?.[SuggestionField.Contents],
          }))
        );
    }

    return of({});
  }
}
