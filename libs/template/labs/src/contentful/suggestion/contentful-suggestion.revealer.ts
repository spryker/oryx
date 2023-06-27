import { inject } from '@spryker-oryx/di';
import {
  SuggestionLinks,
  SuggestionRendererParams,
  SuggestionRevealer,
  SuggestionService,
} from '@spryker-oryx/search';
import { SemanticLinkType } from '@spryker-oryx/site';
import { i18n } from '@spryker-oryx/utilities';
import { map, Observable } from 'rxjs';
import { ContentfulResult } from '../client';

declare module '@spryker-oryx/search' {
  interface SuggestionResponse {
    contentful?: SuggestionLinks;
  }
}

export class ContentfulSuggestionRevealer implements SuggestionRevealer {
  constructor(protected suggestionService = inject(SuggestionService)) {}

  reveal<T = ContentfulResult>(
    data: SuggestionRendererParams
  ): Observable<T | null> {
    const { query, entries } = data;
    return this.suggestionService
      .get<ContentfulResult>({ query, entries })
      .pipe(
        map((data) => {
          const links = data?.contentful?.map((entry) => ({
            name: entry.name,
            url: entry.name,
          }));

          return {
            contentful: links?.length
              ? {
                  title: i18n('search.box.content'),
                  options: links,
                  type: SemanticLinkType.Article,
                }
              : null,
          } as unknown as T;
        })
      );
  }
}
