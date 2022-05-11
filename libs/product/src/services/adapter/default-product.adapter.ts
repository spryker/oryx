import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { map, Observable } from 'rxjs';
import { Product, ProductImage, ProductQualifier } from '../../models';
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

enum INCLUDES {
  ABSTRACT_PRODUCT_IMAGE_SETS = 'abstract-product-image-sets',
}

interface JSON_API_MODEL<T, A> {
  data: {
    attributes: T;
    relationships?: Record<string, Record<'data', RELATIONSHIP[]>>;
  };
  included?: A;
}

type GlueProduct = JSON_API_MODEL<
  Product,
  INCLUDE<INCLUDES.ABSTRACT_PRODUCT_IMAGE_SETS, GlueImageSets>[]
>;

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
    return qualifier.sku ?? '';
  }

  get({ sku, include }: ProductQualifier): Observable<Product> {
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
            product.images = attributes.imageSets.reduce(
              (acc, imageSet) => [...acc, ...imageSet.images],
              [] as ProductImage[]
            );

            break;

          default:
            break;
        }
      }
    );

    return product;
  }
}
