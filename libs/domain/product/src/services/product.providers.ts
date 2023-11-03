import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { merchantProviders } from '../merchant/providers';
import {
  AvailabilityNormalizer,
  CategoryIdNormalizer,
  ConcreteProductsNormalizer,
  DefaultProductAdapter,
  DefaultProductMediaNormalizer,
  FacetCategoryNormalizer,
  FacetNormalizer,
  FacetRangeNormalizer,
  FacetRatingNormalizer,
  PriceNormalizer,
  ProductAdapter,
  ProductMediaSetNormalizer,
  availabilityNormalizer,
  categoryIdNormalizer,
  concreteProductsNormalizer,
  facetCategoryNormalizer,
  facetRatingNormalizer,
  facetsNormalizer,
  facetsRangeNormalizer,
  mediaNormalizer,
  mediaSetNormalizer,
  priceNormalizer,
  productListNormalizer,
  productNormalizer,
} from './adapter';
import {
  ProductLabelsNormalizer,
  productLabelNormalizer,
} from './adapter/normalizers/labels/labels.normalizer';
import {
  OfferNormalizer,
  offerAvailabilityNormalizer,
  offerMerchantNormalizer,
  offerNormalizer,
  offerPriceNormalizer,
} from './adapter/normalizers/offer/offer.normalizer';
import {
  PaginationNormalizer,
  paginationNormalizer,
} from './adapter/normalizers/pagination';
import { relationsListNormalizer } from './adapter/normalizers/relations-list';
import { SortNormalizer, sortNormalizer } from './adapter/normalizers/sort';
import {
  CategoryListNormalizer,
  CategoryNodeNormalizer,
  CategoryNormalizer,
  CategoryTreeNormalizer,
  DefaultProductCategoryAdapter,
  DefaultProductCategoryService,
  ProductCategoryAdapter,
  ProductCategoryService,
  categoryEffects,
  categoryListNormalizerFactory,
  categoryNodeNormalizer,
  categoryNormalizerFactory,
  categoryQuery,
  categoryTreeNormalizer,
} from './category';
import { DefaultProductService } from './default-product.service';
import { DefaultProductImageService } from './images';
import { ProductImageService } from './images/product-image.service';
import {
  ProductMediaConfig,
  productMediaConfig,
} from './images/product-media.config';
import {
  DefaultProductListAdapter,
  DefaultProductListPageService,
  DefaultProductListService,
  ProductListAdapter,
  ProductListPageService,
  ProductListService,
} from './list';
import { ProductContextFallback } from './product-context';
import { ProductService } from './product.service';
import {
  DefaultProductRelationsListAdapter,
  DefaultProductRelationsListService,
  ProductRelationsListAdapter,
  ProductRelationsListService,
} from './related';
import { ProductDetailsBreadcrumb, ProductListBreadcrumb } from './resolvers';
import { ProductPageDescriptionMetaResolver } from './resolvers/product-page-description-meta.resolver';
import { ProductPageTitleMetaResolver } from './resolvers/product-page-title-meta.resolver';
import { productRoutes } from './routes';
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
    provide: ProductRelationsListService,
    useClass: DefaultProductRelationsListService,
  },
  {
    provide: ProductRelationsListAdapter,
    useClass: DefaultProductRelationsListAdapter,
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
    provide: OfferNormalizer,
    useValue: offerNormalizer,
  },
  {
    provide: OfferNormalizer,
    useValue: offerPriceNormalizer,
  },
  {
    provide: OfferNormalizer,
    useValue: offerAvailabilityNormalizer,
  },
  {
    provide: OfferNormalizer,
    useValue: offerMerchantNormalizer,
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
  //TODO: drop and use ordinary range normalizer after https://spryker.atlassian.net/browse/CC-31032
  {
    provide: FacetRatingNormalizer,
    useValue: facetRatingNormalizer,
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
  ...relationsListNormalizer,
  ...productQueries,
  ...productEffects,
  ...categoryEffects,
  ProductContextFallback,
  {
    provide: PageMetaResolver,
    useClass: ProductPageTitleMetaResolver,
  },
  {
    provide: PageMetaResolver,
    useClass: ProductPageDescriptionMetaResolver,
  },
  {
    provide: CategoryIdNormalizer,
    useValue: categoryIdNormalizer,
  },
  {
    provide: CategoryNormalizer,
    useFactory: categoryNormalizerFactory,
  },
  {
    provide: CategoryListNormalizer,
    useFactory: categoryListNormalizerFactory,
  },
  {
    provide: CategoryNodeNormalizer,
    useValue: categoryNodeNormalizer,
  },
  {
    provide: CategoryTreeNormalizer,
    useValue: categoryTreeNormalizer,
  },
  {
    provide: ProductCategoryAdapter,
    useClass: DefaultProductCategoryAdapter,
  },
  {
    provide: ProductCategoryService,
    useClass: DefaultProductCategoryService,
  },
  ProductListBreadcrumb,
  ProductDetailsBreadcrumb,
  categoryQuery,
  ...provideLitRoutes({ routes: productRoutes }),
  ...merchantProviders,
];
