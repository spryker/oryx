import { createQuery, QueryService, QueryState } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { ProductQuery } from '@spryker-oryx/product';
import { Observable } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';
import { SuggestionAdapter } from '../adapter';
import { SuggestionService } from './suggestion.service';

export class DefaultSuggestionService implements SuggestionService {
  protected suggestionsQuery = createQuery<Suggestion, SuggestionQualifier>({
    loader: (qualifier) => this.adapter.get(qualifier),
    onLoad: [
      ({ data }) =>
        data?.products.forEach((product) =>
          this.query
            .getQuery(ProductQuery)
            ?.set({ data: product, qualifier: { sku: product.sku } })
        ),
    ],
  });

  constructor(
    protected adapter = inject(SuggestionAdapter),
    protected query = inject(QueryService)
  ) {}

  get(qualifier: SuggestionQualifier): Observable<Suggestion | undefined> {
    return this.suggestionsQuery.get(qualifier);
  }

  getState(qualifier: SuggestionQualifier): Observable<QueryState<Suggestion>> {
    return this.suggestionsQuery.getState(qualifier);
  }
}
