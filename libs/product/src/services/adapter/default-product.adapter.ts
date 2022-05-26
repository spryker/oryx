import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { map, Observable } from 'rxjs';
import {
  Product,
  ProductImage,
  ProductPrice,
  ProductQualifier,
} from '../../models';
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

interface GlueImageSets {
  imageSets: {
    name: string;
    images: ProductImage[];
  }[];
}

interface GlueProductPrices {
  price: number;
  prices: ProductPrice[];
}

enum INCLUDES {
  ABSTRACT_PRODUCT_IMAGE_SETS = 'abstract-product-image-sets',
  ABSTRACT_PRODUCT_PRICES = 'abstract-product-prices',
}

interface JSON_API_MODEL<T, A> {
  data: {
    attributes: T;
    relationships?: Record<string, Record<'data', RELATIONSHIP[]>>;
  };
  included?: A;
}

type ProductIncludes =
  | INCLUDE<INCLUDES.ABSTRACT_PRODUCT_IMAGE_SETS, GlueImageSets>
  | INCLUDE<INCLUDES.ABSTRACT_PRODUCT_PRICES, GlueProductPrices>;

type GlueProduct = JSON_API_MODEL<Product, ProductIncludes[]>;

export class DefaultProductAdapter implements ProductAdapter {
  protected productEndpoint = 'abstract-products';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL')
  ) {}

  normalize(product: GlueProduct): Product {
    return { ...product.data.attributes, ...this.mapIncludes(product) };
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
          case INCLUDES.ABSTRACT_PRODUCT_IMAGE_SETS:
            product.images = (attributes as GlueImageSets).imageSets.reduce(
              (acc, imageSet) => [...acc, ...imageSet.images],
              [] as ProductImage[]
            );

            break;
          case INCLUDES.ABSTRACT_PRODUCT_PRICES:
            product.price = (attributes as GlueProductPrices).price;
            product.prices = (attributes as GlueProductPrices).prices;

            break;
          default:
            break;
        }
      }
    );

    return product;
  }
}
