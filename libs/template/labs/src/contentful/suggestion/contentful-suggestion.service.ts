import { createQuery, QueryState } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { ProductsLoaded } from '@spryker-oryx/product';
import {
  Suggestion,
  SuggestionQualifier,
  SuggestionService,
} from '@spryker-oryx/search';
import { CurrencyChanged } from '@spryker-oryx/site';
import { Observable } from 'rxjs';
import { ContentfulSuggestionAdapter } from './contentful-suggestion.adapter';

export const ContentfulSuggestionService = 'oryx.ContentfulSuggestionService';

declare global {
  interface InjectionTokensContractMap {
    [ContentfulSuggestionService]: SuggestionService;
  }
}

export class DefaultContentfulSuggestionService implements SuggestionService {
  protected suggestionsQuery = createQuery<Suggestion, SuggestionQualifier>({
    loader: (qualifier) => this.adapter.get(qualifier),
    onLoad: [ProductsLoaded],
    refreshOn: [LocaleChanged, CurrencyChanged],
  });

  constructor(protected adapter = inject(ContentfulSuggestionAdapter)) {}

  get(qualifier: SuggestionQualifier): Observable<Suggestion | undefined> {
    return this.suggestionsQuery.get(qualifier);
  }

  getState(qualifier: SuggestionQualifier): Observable<QueryState<Suggestion>> {
    return this.suggestionsQuery.getState(qualifier);
  }
}
