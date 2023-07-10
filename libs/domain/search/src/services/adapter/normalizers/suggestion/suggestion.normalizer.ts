import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { Provider } from '@spryker-oryx/di';
import {
  ApiProductModel,
  ConcreteProductsNormalizer,
  Product,
} from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { map, Observable } from 'rxjs';
import { Suggestion } from '../../../../models';
import { SuggestionField } from '../../suggestion.adapter';
import { DeserializedSuggestion } from './model';

export const SuggestionNormalizer = 'oryx.SuggestionNormalizer*';

export function suggestionAttributesNormalizer(
  data: DeserializedSuggestion[]
): Partial<Suggestion> {
  const { completion, categories, categoryCollection } = data[0];

  return {
    [SuggestionField.Suggestions]: completion.map((name) => ({
      name,
      params: { q: name },
      type: SemanticLinkType.ProductList,
    })),
    [SuggestionField.Categories]: categories.map((category) => ({
      name: category.name,
      id: categoryCollection?.find(
        (collection) => category.name === collection.name
      )?.idCategory,
      type: SemanticLinkType.Category,
    })),
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
    .pipe(map((products) => ({ [SuggestionField.Products]: products })));
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
