import { inject } from '@spryker-oryx/di';
import { SemanticLinkType } from '@spryker-oryx/site';
import { i18n } from '@spryker-oryx/utilities';
import { map, Observable } from 'rxjs';
import { Suggestion, SuggestionLinks } from '../../../models';
import { SuggestionField } from '../../adapter';
import { SuggestionRendererParams } from '../renderer';
import { SuggestionService } from '../suggestion.service';
import { SuggestionRevealer } from './suggestion-revealer.service';

export class DefaultSuggestionRevealer implements SuggestionRevealer {
  constructor(protected suggestionService = inject(SuggestionService)) {}

  reveal<T = Suggestion | SuggestionLinks>(
    params: SuggestionRendererParams
  ): Observable<T | null> {
    const { query, entries, ...options } = params;
    const isVisible = (field: SuggestionField) =>
      entries && entries.includes(field);

    return this.suggestionService.get({ query, entries }).pipe(
      map((raw) =>
        raw
          ? ({
              completion: isVisible(SuggestionField.Completion)
                ? {
                    title: i18n('search.box.suggestions'),
                    options:
                      raw.completion
                        ?.slice(0, options.completionsCount)
                        ?.map((name) => ({
                          name,
                          params: { q: name },
                        })) ?? [],
                    type: SemanticLinkType.ProductList,
                  }
                : undefined,
              products: isVisible(SuggestionField.Products)
                ? raw.products?.slice(0, options.productsCount) ?? []
                : undefined,
              categories: isVisible(SuggestionField.Categories)
                ? {
                    title: i18n('search.box.categories'),
                    options:
                      raw.categories
                        ?.slice(0, options.categoriesCount)
                        ?.map(({ name, idCategory }) => ({
                          name,
                          idCategory,
                        })) ?? [],
                    type: SemanticLinkType.Category,
                  }
                : undefined,
            } as unknown as T)
          : null
      )
    );
  }
}
