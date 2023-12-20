import { createQuery, QueryState } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { ProductsLoaded } from '@spryker-oryx/product';
import { CurrencyChanged, PriceModeChanged } from '@spryker-oryx/site';
import { merge, Observable, scan } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';
import { SuggestionAdapter } from '../adapter';
import { SuggestionService } from './suggestion.service';

export class DefaultSuggestionService implements SuggestionService {
  constructor(protected adapters = inject(SuggestionAdapter)) {}

  protected suggestionsQuery = createQuery<Suggestion, SuggestionQualifier>({
    loader: (qualifier) =>
      merge(...this.adapters.map((adapter) => adapter.get(qualifier))).pipe(
        scan((acc, curr) => ({ ...acc, ...curr }))
      ),
    onLoad: [ProductsLoaded],
    refreshOn: [LocaleChanged, CurrencyChanged, PriceModeChanged],
  });

  get(qualifier: SuggestionQualifier): Observable<Suggestion | undefined> {
    return this.suggestionsQuery.get(qualifier);
  }

  getState(qualifier: SuggestionQualifier): Observable<QueryState<Suggestion>> {
    return this.suggestionsQuery.getState(qualifier);
  }
}
