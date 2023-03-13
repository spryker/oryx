import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { ApiProductModel } from '@spryker-oryx/product';
import { CurrencyService } from '@spryker-oryx/site';
import { Observable, switchMap, take } from 'rxjs';
import {
  ApiSuggestionModel,
  Suggestion,
  SuggestionQualifier,
} from '../../models';
import { SuggestionNormalizer } from './normalizers';
import { SuggestionAdapter } from './suggestion.adapter';

export class DefaultSuggestionAdapter implements SuggestionAdapter {
  protected queryEndpoint = 'catalog-search-suggestions';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected currencyService = inject(CurrencyService)
  ) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query }: SuggestionQualifier): Observable<Suggestion> {
    const include = [
      ApiProductModel.Includes.AbstractProducts,
      ApiProductModel.Includes.ConcreteProducts,
      ApiProductModel.Includes.ConcreteProductImageSets,
      ApiProductModel.Includes.ConcreteProductPrices,
      ApiProductModel.Includes.ConcreteProductAvailabilities,
      ApiProductModel.Includes.Labels,
    ].join(',');

    return this.currencyService.get().pipe(
      take(1),
      switchMap((currency) =>
        this.http.get<ApiSuggestionModel.Response>(
          `${this.SCOS_BASE_URL}/${this.queryEndpoint}?q=${query}&currency=${currency}&include=${include}`
        )
      ),
      this.transformer.do(SuggestionNormalizer)
    );
  }
}
