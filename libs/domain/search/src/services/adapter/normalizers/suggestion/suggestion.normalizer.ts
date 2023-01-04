import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { Provider } from '@spryker-oryx/di';
import {
  ApiProductModel,
  ConcreteProductsNormalizer,
  Product,
} from '@spryker-oryx/product';
import { map, Observable } from 'rxjs';
import { Suggestion } from '../../../../models';
import { DeserializedSuggestion } from './model';

export const SuggestionNormalizer = 'FES.SuggestionNormalizer*';

export function suggestionAttributesNormalizer(
  data: DeserializedSuggestion[]
): Partial<Suggestion> {
  const { completion, categories, cmsPages } = data[0];

  return {
    completion,
    categories,
    cmsPages,
  };
}

export function suggestionProductNormalizer(
  data: DeserializedSuggestion[],
  transformer: TransformerService
): Observable<Partial<Suggestion>> {
  const abstractsKey = camelize(ApiProductModel.Includes.AbstractProducts);
  const { [abstractsKey]: products } = data[0];

  return transformer
    .transform<Product[]>(products, ConcreteProductsNormalizer)
    .pipe(map((products) => ({ products })));
}

export const suggestionNormalizer: Provider[] = [
  {
    provide: SuggestionNormalizer,
    useValue: suggestionAttributesNormalizer,
  },
  {
    provide: SuggestionNormalizer,
    useValue: suggestionProductNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [SuggestionNormalizer]: Transformer<Suggestion>[];
  }
}
