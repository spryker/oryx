import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import {
  ApiProductModel,
  imagesNormalizer,
  priceNormalizer,
  Product,
} from '@spryker-oryx/product';
import { Include, JsonApiModel } from '@spryker-oryx/typescript-utils';
import { map, Observable } from 'rxjs';
import {
  ApiModel,
  Resource,
  Suggestion,
  SuggestionQualifier,
} from '../../models';
import { SuggestionAdapter } from './suggestion.adapter';

enum INCLUDES {
  CONCRETE_PRODUCTS = 'concrete-products',
  ABSTRACT_PRODUCTS = 'abstract-products',
  CONCRETE_PRODUCT_IMAGE_SETS = 'concrete-product-image-sets',
  CONCRETE_PRODUCT_PRICES = 'concrete-product-prices',
}

export interface SuggestionResponse {
  completion: string[];
  categories: Resource[];
  cmsPages: Resource[];
}

type structures =
  | ApiProductModel.Attributes
  | ApiProductModel.ImageSets
  | ApiProductModel.Prices;

type includes =
  | Include<INCLUDES.CONCRETE_PRODUCTS, ApiProductModel.Attributes>
  | Include<INCLUDES.ABSTRACT_PRODUCTS, ApiModel.AbstractProduct>
  | Include<INCLUDES.CONCRETE_PRODUCT_IMAGE_SETS, ApiProductModel.ImageSets>
  | Include<INCLUDES.CONCRETE_PRODUCT_PRICES, ApiProductModel.Prices>;

type GlueSuggestion = JsonApiModel<
  SuggestionResponse,
  includes[],
  Array<unknown>
>;

export class DefaultServiceAdapter implements SuggestionAdapter {
  protected productEndpoint = 'catalog-search-suggestions';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL')
  ) {}

  normalize(response: GlueSuggestion): Suggestion {
    const { completion, categories, cmsPages } = response.data[0].attributes;
    return {
      completion,
      categories,
      cmsPages,
      products: this.mapIncludes(response),
    };
  }

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query }: SuggestionQualifier): Observable<Suggestion> {
    return this.http
      .get<GlueSuggestion>(
        `${this.SCOS_BASE_URL}/${this.productEndpoint}?q=${query}&include=abstract-products,concrete-products,concrete-product-image-sets,concrete-product-prices`
      )
      .pipe(map((res) => this.normalize(res)));
  }

  protected getRelationId<T extends INCLUDES>(
    resource: includes,
    relationType: T
  ): string | void {
    return resource?.relationships?.[relationType].data[0].id;
  }

  protected getRelation<T extends INCLUDES, A extends structures>(
    included: includes[],
    resource: includes,
    relationType: T
  ): Include<T, A> | undefined {
    return included.find(
      (include) =>
        include.type === relationType &&
        include.id === this.getRelationId<T>(resource, relationType)
    ) as Include<T, A>;
  }

  protected mapIncludes({ included }: GlueSuggestion): Product[] {
    if (!included) {
      return [];
    }

    return included
      .filter(({ type }) => type === INCLUDES.ABSTRACT_PRODUCTS)
      .map((abstractProduct) => {
        const rawProduct = this.getRelation<
          INCLUDES.CONCRETE_PRODUCTS,
          ApiProductModel.Attributes
        >(included, abstractProduct, INCLUDES.CONCRETE_PRODUCTS);

        if (!rawProduct) {
          return;
        }

        const { name, sku, description }: ApiProductModel.Attributes =
          rawProduct.attributes;

        const images = this.getRelation<
          INCLUDES.CONCRETE_PRODUCT_IMAGE_SETS,
          ApiProductModel.ImageSets
        >(included, rawProduct, INCLUDES.CONCRETE_PRODUCT_IMAGE_SETS);

        const price = this.getRelation<
          INCLUDES.CONCRETE_PRODUCT_PRICES,
          ApiProductModel.Prices
        >(included, rawProduct, INCLUDES.CONCRETE_PRODUCT_PRICES);

        return {
          name,
          sku,
          description,
          ...(images ? { images: imagesNormalizer(images.attributes) } : {}),
          ...(price ? { price: priceNormalizer(price.attributes) } : {}),
        };
      })
      .filter((product) => product) as Product[];
  }
}
