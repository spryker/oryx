import { createQuery, QueryState } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { ProductsLoaded } from '@spryker-oryx/product';
import { CurrencyChanged, LocaleChanged } from '@spryker-oryx/site';
import { Observable } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';
import { SuggestionAdapter } from '../adapter';
import { SuggestionService } from './suggestion.service';

export class DefaultSuggestionService implements SuggestionService {
  protected suggestionsQuery = createQuery<Suggestion, SuggestionQualifier>({
    loader: (qualifier) => this.adapter.get(qualifier),
    onLoad: [ProductsLoaded],
    refreshOn: [LocaleChanged, CurrencyChanged],
  });

  constructor(protected adapter = inject(SuggestionAdapter)) {}

  get(qualifier: SuggestionQualifier): Observable<Suggestion | undefined> {
    return this.suggestionsQuery.get(qualifier);
  }

  getState(qualifier: SuggestionQualifier): Observable<QueryState<Suggestion>> {
    return this.suggestionsQuery.getState(qualifier);
  }
}
