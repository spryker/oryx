import {
  HttpService,
  JsonApiIncludeService,
  JsonAPITransformerService,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { ApiProductModel, ProductListResource } from '@spryker-oryx/product';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable, of, switchMap } from 'rxjs';
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
    protected transformer = inject(JsonAPITransformerService),
    protected includeService = inject(JsonApiIncludeService)
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
      if (featureVersion >= '1.4') {
        const includes$ = entities?.includes(SuggestionField.Products)
          ? this.includeService.get({ resource: ProductListResource })
          : of('');

        return includes$.pipe(
          switchMap((includes) =>
            this.http.get(
              `${this.SCOS_BASE_URL}/${this.queryEndpoint}?q=${query}&${includes}`
            )
          ),
          this.transformer.do(SuggestionNormalizer)
        );
      } else {
        const include = entities?.includes(SuggestionField.Products)
          ? [
              ApiProductModel.Includes.AbstractProducts,
              ApiProductModel.Includes.CategoryNodes,
              ApiProductModel.Includes.ConcreteProducts,
              ApiProductModel.Includes.ConcreteProductImageSets,
              ApiProductModel.Includes.ConcreteProductPrices,
              ApiProductModel.Includes.ConcreteProductAvailabilities,
              ApiProductModel.Includes.Labels,
            ].join(',')
          : '';

        return this.http
          .get<ApiSuggestionModel.Response>(
            `${this.SCOS_BASE_URL}/${this.queryEndpoint}?q=${query}&include=${include}`
          )
          .pipe(this.transformer.do(SuggestionNormalizer));
      }
    }

    return of({});
  }
}
