import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { ApiProductModel } from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import {
  ApiSuggestionModel,
  SuggestionQualifier,
  SuggestionResponse,
} from '../../models';
import { SuggestionNormalizer } from './normalizers';
import { SuggestionAdapter, SuggestionField } from './suggestion.adapter';

export class DefaultSuggestionAdapter implements SuggestionAdapter {
  protected queryEndpoint = 'catalog-search-suggestions';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query, entries }: SuggestionQualifier): Observable<SuggestionResponse> {
    if (
      !entries ||
      entries.some((entry) =>
        Object.values<string>(SuggestionField).includes(entry)
      )
    ) {
      const include = [
        ApiProductModel.Includes.AbstractProducts,
        ApiProductModel.Includes.ConcreteProducts,
        ApiProductModel.Includes.ConcreteProductImageSets,
        ApiProductModel.Includes.ConcreteProductPrices,
        ApiProductModel.Includes.ConcreteProductAvailabilities,
        ApiProductModel.Includes.Labels,
      ].join(',');

      return this.http
        .get<ApiSuggestionModel.Response>(
          `${this.SCOS_BASE_URL}/${this.queryEndpoint}?q=${query}&include=${include}`
        )
        .pipe(this.transformer.do(SuggestionNormalizer));
    }

    return of({});
  }
}
