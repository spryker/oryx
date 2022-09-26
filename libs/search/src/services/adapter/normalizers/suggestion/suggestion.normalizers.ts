import { Transformer, TransformerService } from '@spryker-oryx/core';
import {
  ApiProductModel,
  ConcreteProductsNormalizers,
  Product,
} from '@spryker-oryx/product';
import { camelize } from '@spryker-oryx/typescript-utils';
import { map, Observable } from 'rxjs';
import { Suggestion } from '../../../../models';
import { DeserializedSuggestion } from './model';

export const SuggestionNormalizers = 'FES.SuggestionNormalizers';

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
    .transform<Product[]>(products, ConcreteProductsNormalizers)
    .pipe(map((products) => ({ products })));
}

export const suggestionNormalizers = [
  suggestionAttributesNormalizer,
  suggestionProductNormalizer,
];

declare global {
  interface InjectionTokensContractMap {
    [SuggestionNormalizers]: Transformer<Suggestion>[];
  }
}
