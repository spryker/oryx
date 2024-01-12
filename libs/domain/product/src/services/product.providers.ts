import {
  PageMetaResolver,
  TokenResourceResolvers,
  provideEntity,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { featureVersion } from '@spryker-oryx/utilities';
import { CATEGORY } from '../entity';
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
  productIncludes,
  productListNormalizer,
  productNormalizer,
} from './adapter';
import {
  ProductLabelsNormalizer,
  productLabelNormalizer,
} from './adapter/normalizers/labels/labels.normalizer';
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
  categoryQueries,
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
import { productListIncludes } from './list/adapter/product-list-includes';
import {
  ProductContext,
  ProductContextFallback,
  productContextProviders,
} from './product-context';
import { ProductService } from './product.service';
import {
  DefaultProductRelationsListAdapter,
  DefaultProductRelationsListService,
  ProductRelationsListAdapter,
  ProductRelationsListService,
} from './related';
import {
  ProductDetailsBreadcrumb,
  ProductListBreadcrumb,
  ProductPageCanonicalUrlResolver,
  ProductPageRobotMetaResolver,
} from './resolvers';
import { ProductPageDescriptionMetaResolver } from './resolvers/product-page-description-meta.resolver';
import { ProductPageTitleMetaResolver } from './resolvers/product-page-title-meta.resolver';
import { productRoutes } from './routes';
import { productEffects } from './state/effects';
import { productQueries } from './state/queries';

export const ProductTokenResourceResolverToken = `${TokenResourceResolvers}PRODUCT`;

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
  ...productIncludes,
  ...productListIncludes,
  ProductContextFallback,
  ...productContextProviders,
  {
    provide: PageMetaResolver,
    useClass: ProductPageTitleMetaResolver,
  },
  {
    provide: PageMetaResolver,
    useClass: ProductPageDescriptionMetaResolver,
  },
  {
    provide: PageMetaResolver,
    useClass: ProductPageCanonicalUrlResolver,
  },
  {
    provide: PageMetaResolver,
    useClass: ProductPageRobotMetaResolver,
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
  ...categoryQueries,
  ...(featureVersion >= '1.4'
    ? []
    : provideLitRoutes({ routes: productRoutes })),
  provideEntity('product', {
    service: ProductService,
    context: featureVersion >= '1.4' ? ProductContext.SKU : undefined,
  }),
  provideEntity(CATEGORY, {
    service: ProductCategoryService,
  }),
];
