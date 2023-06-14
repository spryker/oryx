import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  AlternativeProductsListAdapter,
  availabilityNormalizer,
  AvailabilityNormalizer,
  ConcreteProductsNormalizer,
  concreteProductsNormalizer,
  DefaultAlternativeProductsListAdapter,
  DefaultProductAdapter,
  DefaultProductListAdapter,
  DefaultProductMediaNormalizer,
  facetCategoryNormalizer,
  FacetCategoryNormalizer,
  FacetNormalizer,
  FacetRangeNormalizer,
  facetsNormalizer,
  facetsRangeNormalizer,
  mediaNormalizer,
  mediaSetNormalizer,
  PriceNormalizer,
  priceNormalizer,
  ProductAdapter,
  ProductListAdapter,
  productListNormalizer,
  ProductMediaSetNormalizer,
  productNormalizer,
} from './adapter';
import { alternativeProductsListNormalizer } from './adapter/normalizers/alternative-products-list';
import {
  productLabelNormalizer,
  ProductLabelsNormalizer,
} from './adapter/normalizers/labels/labels.normalizer';
import {
  paginationNormalizer,
  PaginationNormalizer,
} from './adapter/normalizers/pagination';
import { sortNormalizer, SortNormalizer } from './adapter/normalizers/sort';
import { AlternativeProductsListService } from './alternative-products-list.service';
import { DefaultAlternativeProductsListService } from './default-alternative-products-list.service';
import { DefaultProductListPageService } from './default-product-list-page.service';
import { DefaultProductListService } from './default-product-list.service';
import { DefaultProductService } from './default-product.service';
import { DefaultProductImageService } from './images';
import { ProductImageService } from './images/product-image.service';
import {
  productMediaConfig,
  ProductMediaConfig,
} from './images/product-media.config';
import { ProductContextFallback } from './product-context';
import { ProductListPageService } from './product-list-page.service';
import { ProductListService } from './product-list.service';
import { ProductService } from './product.service';
import { ProductPageDescriptionMetaResolver } from './resolvers/product-page-description-meta.resolver';
import { ProductPageTitleMetaResolver } from './resolvers/product-page-title-meta.resolver';
import { productEffects } from './state/effects';
import { productQueries } from './state/queries';

export const productProviders: Provider[] = [
  {
    provide: ProductAdapter,
    useClass: DefaultProductAdapter,
  },
  {
    provide: ProductService,
    useClass: DefaultProductService,
  },
  {
    provide: ProductListAdapter,
    useClass: DefaultProductListAdapter,
  },
  {
    provide: ProductListService,
    useClass: DefaultProductListService,
  },
  {
    provide: AlternativeProductsListService,
    useClass: DefaultAlternativeProductsListService,
  },
  {
    provide: AlternativeProductsListAdapter,
    useClass: DefaultAlternativeProductsListAdapter,
  },
  {
    provide: ProductListPageService,
    useClass: DefaultProductListPageService,
  },
  {
    provide: PriceNormalizer,
    useValue: priceNormalizer,
  },
  {
    provide: FacetNormalizer,
    useValue: facetsNormalizer,
  },
  {
    provide: FacetRangeNormalizer,
    useValue: facetsRangeNormalizer,
  },
  {
    provide: SortNormalizer,
    useValue: sortNormalizer,
  },
  {
    provide: PaginationNormalizer,
    useValue: paginationNormalizer,
  },
  {
    provide: FacetCategoryNormalizer,
    useValue: facetCategoryNormalizer,
  },
  {
    provide: AvailabilityNormalizer,
    useValue: availabilityNormalizer,
  },
  {
    provide: ProductLabelsNormalizer,
    useValue: productLabelNormalizer,
  },
  {
    provide: ProductMediaSetNormalizer,
    useValue: mediaSetNormalizer,
  },
  {
    provide: DefaultProductMediaNormalizer,
    useValue: mediaNormalizer,
  },
  {
    provide: ConcreteProductsNormalizer,
    useValue: concreteProductsNormalizer,
  },
  {
    provide: ProductImageService,
    useClass: DefaultProductImageService,
  },
  {
    provide: ProductMediaConfig,
    useValue: productMediaConfig,
  },
  ...productNormalizer,
  ...productListNormalizer,
  ...alternativeProductsListNormalizer,
  ...productQueries,
  ...productEffects,
  ProductContextFallback,
  {
    provide: PageMetaResolver,
    useClass: ProductPageTitleMetaResolver,
  },
  {
    provide: PageMetaResolver,
    useClass: ProductPageDescriptionMetaResolver,
  },
];
