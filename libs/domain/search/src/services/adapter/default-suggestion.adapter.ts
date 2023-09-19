import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { ApiProductModel } from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import {
  ApiSuggestionModel,
  Suggestion,
  SuggestionQualifier,
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

  /**
   * @deprecated Since version 1.1. Will be removed.
   */
  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query, entities }: SuggestionQualifier): Observable<Suggestion> {
    if (
      !entities?.length ||
      entities.some((entity) =>
        [
          SuggestionField.Categories,
          SuggestionField.Suggestions,
          SuggestionField.Products,
        ].includes(entity as SuggestionField)
      )
    ) {
      const product =
        entities?.includes(SuggestionField.Products) || !entities?.length
          ? [
              ApiProductModel.Includes.AbstractProducts,
              ApiProductModel.Includes.ConcreteProducts,
              ApiProductModel.Includes.ConcreteProductImageSets,
              ApiProductModel.Includes.ConcreteProductPrices,
              ApiProductModel.Includes.ConcreteProductAvailabilities,
              ApiProductModel.Includes.Labels,
            ].join(',')
          : '';
      const categories =
        entities?.includes(SuggestionField.Categories) || !entities?.length
          ? ApiProductModel.Includes.CategoryNodes
          : '';
      const includes = [product, categories].filter(Boolean).join(',');

      return this.http
        .get<ApiSuggestionModel.Response>(
          `${this.SCOS_BASE_URL}/${this.queryEndpoint}?q=${query}&include=${includes}`
        )
        .pipe(this.transformer.do(SuggestionNormalizer));
    }

    return of({});
  }
}
