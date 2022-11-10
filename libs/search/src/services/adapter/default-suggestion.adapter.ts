import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Observable } from 'rxjs';
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
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query }: SuggestionQualifier): Observable<Suggestion> {
    return this.http
      .get<ApiSuggestionModel.Response>(
        `${this.SCOS_BASE_URL}/${this.queryEndpoint}?q=${query}&include=abstract-products,concrete-products,concrete-product-image-sets,concrete-product-prices`
      )
      .pipe(this.transformer.do(SuggestionNormalizer));
  }
}
