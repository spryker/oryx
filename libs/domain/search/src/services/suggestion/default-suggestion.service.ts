import { createQuery, QueryState } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { ProductsLoaded } from '@spryker-oryx/product';
import { CurrencyChanged } from '@spryker-oryx/site';
import { combineLatest, map, Observable } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';
import { SuggestionAdapter } from '../adapter';
import { SuggestionService } from './suggestion.service';

export class DefaultSuggestionService implements SuggestionService {
  constructor(protected adapters = inject(SuggestionAdapter)) {}

  protected suggestionsQuery = createQuery<Suggestion, SuggestionQualifier>({
    loader: (qualifier) =>
      combineLatest(
        this.adapters.map((adapter) => adapter.get(qualifier))
      ).pipe(
        map((suggestions) =>
          suggestions.reduce((acc, curr) => ({ ...acc, ...curr }), {})
        )
      ),
    onLoad: [ProductsLoaded],
    refreshOn: [LocaleChanged, CurrencyChanged],
  });

  get<T = Suggestion>(
    qualifier: SuggestionQualifier
  ): Observable<T | undefined> {
    return this.suggestionsQuery.get(qualifier) as Observable<T | undefined>;
  }

  getState(qualifier: SuggestionQualifier): Observable<QueryState<Suggestion>> {
    return this.suggestionsQuery.getState(qualifier);
  }
}
