import { inject } from '@spryker-oryx/di';
import {
  ApiExperienceCmsModel,
  ExperienceAdapter,
  ExperienceCms,
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
  data: ApiExperienceCmsModel.Model
): ExperienceCms {
  if (data.qualifier.query) {
    return {
      [SuggestionField.Contents]: data.data.items.map((entry) => ({
        name: entry.fields.heading,
        id: entry.fields.id,
        type: ContentfulContentFields.Article,
      })),
    };
  }

  return {};
}

export class DefaultContentfulSuggestionAdapter implements SuggestionAdapter {
  constructor(protected experienceCmsAdapter = inject(ExperienceAdapter)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query, entities }: SuggestionQualifier): Observable<Suggestion> {
    if (
      entities?.includes(SuggestionField.Contents) ||
      entities?.includes(ContentfulContentFields.Article)
    ) {
      return this.experienceCmsAdapter
        .getCmsData({
          query: this.getKey({ query }),
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
