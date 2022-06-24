import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { map, Observable } from 'rxjs';
import { ApiModel, Product, ProductQualifier } from '../../models';
import {
  convertProductImages,
  GlueImageSets,
} from './converters/product-image.converter';
import {
  convertPrices,
  GlueProductPrices,
} from './converters/product-price.converter';
import { ProductAdapter } from './product.adapter';

interface RELATIONSHIP {
  id: string;
  type: string;
}

interface INCLUDE<T, A> {
  type: T;
  id: string;
  attributes: A;
}

enum INCLUDES {
  CONCRETE_PRODUCT_IMAGE_SETS = 'concrete-product-image-sets',
  CONCRETE_PRODUCT_PRICES = 'concrete-product-prices',
}

interface JSON_API_MODEL<T, A> {
  data: {
    attributes: T;
    relationships?: Record<string, Record<'data', RELATIONSHIP[]>>;
  };
  included?: A;
}

type ProductIncludes =
  | INCLUDE<INCLUDES.CONCRETE_PRODUCT_IMAGE_SETS, GlueImageSets>
  | INCLUDE<INCLUDES.CONCRETE_PRODUCT_PRICES, GlueProductPrices>;

type GlueProduct = JSON_API_MODEL<ApiModel.Product, ProductIncludes[]>;

export class DefaultProductAdapter implements ProductAdapter {
  protected productEndpoint = 'concrete-products';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL')
  ) {}

  normalize(product: GlueProduct): Product {
    return {
      ...this.convertAttributes(product.data.attributes),
      ...this.mapIncludes(product),
    };
  }

  getKey(qualifier: ProductQualifier): string {
    return (qualifier.sku ?? '') + qualifier.include?.sort()?.join('');
  }

  get({ sku, include }: ProductQualifier): Observable<Product> {
    include = [...Object.values(INCLUDES), ...(include ?? [])].filter(
      (type, index, arr) => arr.indexOf(type) === index
    );

    return this.http
      .get<GlueProduct>(
        `${this.SCOS_BASE_URL}/${this.productEndpoint}/${sku}${
          include ? '?include=' : ''
        }${include?.join(',') || ''}`
      )
      .pipe(map((res) => this.normalize(res)));
  }

  protected convertAttributes(attributes: ApiModel.Product): Product {
    const { sku, name, description, averageRating, reviewCount } = attributes;
    const product: Product = {
      sku,
      name,
      description,
      averageRating,
      reviewCount,
    };
    return Object.fromEntries(
      Object.entries(product).filter(([, v]) => v != null)
    );
  }

  protected mapIncludes(response: GlueProduct): Product {
    if (!response?.included || !response?.data?.relationships) {
      return {} as Product;
    }

    const product: Product = {};

    response.included.forEach(
      ({ type: includeType, id: includeId, attributes }) => {
        const relationship = response.data.relationships?.[includeType];

        if (!relationship) return;

        const exist = relationship.data.find(
          ({ type, id }) => includeType === type && includeId === id
        );

        if (!exist) return;

        switch (includeType) {
          case INCLUDES.CONCRETE_PRODUCT_IMAGE_SETS:
            product.images = convertProductImages(attributes as GlueImageSets);

            break;
          case INCLUDES.CONCRETE_PRODUCT_PRICES:
            product.price = convertPrices(attributes as GlueProductPrices);
            break;
          default:
            break;
        }
      }
    );

    return product;
  }
}
