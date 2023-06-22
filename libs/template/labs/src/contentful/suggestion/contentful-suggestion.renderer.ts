import { inject } from '@spryker-oryx/di';
import {
  Suggestion,
  SuggestionRenderer,
  SuggestionRendererOptions,
} from '@spryker-oryx/search';
import { SemanticLinkType } from '@spryker-oryx/site';
import { i18n } from '@spryker-oryx/utilities';
import { map, Observable } from 'rxjs';
import { ContentfulSuggestionService } from './contentful-suggestion.service';

export class ContentfulSuggestionRenderer implements SuggestionRenderer {
  constructor(
    protected suggestionService = inject(ContentfulSuggestionService)
  ) {}

  getSuggestions<T = Suggestion>(
    data: SuggestionRendererOptions & { query: string }
  ): Observable<T | null> {
    const { query, ...options } = data;

    return this.suggestionService
      .get({
        query,
      })
      .pipe(
        map((entries) => {
          const links = entries?.cmsPages
            ?.slice(0, options.cmsCount)
            ?.map((entry) => ({
              name: entry.name,
              url: entry.name,
            }));

          return links?.length
            ? {
                title: i18n('search.box.content'),
                options: links,
                type: SemanticLinkType.Article,
              }
            : null;
        })
      ) as unknown as Observable<T | null>;
  }
}
