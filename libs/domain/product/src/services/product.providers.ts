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
  GlueProductAdapter,
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
} from './adapter';
import {
  PaginationNormalizer,
  paginationNormalizer,
} from './adapter/spryker-glue/normalizers/pagination';
import { relationsListNormalizer } from './adapter/spryker-glue/normalizers/relations-list';
import { SortNormalizer, sortNormalizer } from './adapter/spryker-glue/normalizers/sort';
import {
  CategoryListNormalizer,
  CategoryNodeNormalizer,
  CategoryNormalizer,
  CategoryTreeNormalizer,
  GlueProductCategoryAdapter,
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
import { productJsonLdNormalizers } from './jsonld';
import {
  GlueProductListAdapter,
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
  GlueProductRelationsListAdapter,
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

export const glueProductConnectors = [
  {
    provide: ProductAdapter,
    useClass: GlueProductAdapter,
  },
  {
    provide: ProductListAdapter,
    useClass: GlueProductListAdapter,
  },
  {
    provide: ProductRelationsListAdapter,
    useClass: GlueProductRelationsListAdapter,
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
  ...productNormalizer,
  ...productListNormalizer,
  ...relationsListNormalizer,
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
    useClass: GlueProductCategoryAdapter,
  },
]

export const productProviders: Provider[] = [
  {
    provide: ProductListService,
    useClass: DefaultProductListService,
  },
  {
    provide: ProductService,
    useClass: DefaultProductService,
  },
  {
    provide: ProductListPageService,
    useClass: DefaultProductListPageService,
  },
  {
    provide: ProductRelationsListService,
    useClass: DefaultProductRelationsListService,
  },
  {
    provide: ProductImageService,
    useClass: DefaultProductImageService,
  },
  {
    provide: ProductMediaConfig,
    useValue: productMediaConfig,
  },
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
  ...productJsonLdNormalizers,
];

export const glueProductProviders = [
  ...productProviders,
  ...glueProductConnectors
]
