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
  DefaultProductMediaNormalizer,
  FacetCategoryNormalizer,
  FacetNormalizer,
  FacetRangeNormalizer,
  FacetRatingNormalizer,
  GlueProductAdapter,
  PriceNormalizer,
  ProductAdapter,
  ProductLabelsNormalizer,
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
  productLabelNormalizer,
  productListNormalizer,
  productNormalizer,
} from './adapter';
import { MockProductListAdapter } from './adapter/mock';
import { MockProductCategoryAdapter } from './adapter/mock/mock-category.adapter';
import { MockProductAdapter } from './adapter/mock/mock-product.adapter';
import { MockProductRelationsListAdapter } from './adapter/mock/product-relations/mock-product-relations-list.adapter';
import {
  PaginationNormalizer,
  paginationNormalizer,
} from './adapter/spryker-glue/normalizers/pagination';
import { relationsListNormalizer } from './adapter/spryker-glue/normalizers/relations-list';
import {
  SortNormalizer,
  sortNormalizer,
} from './adapter/spryker-glue/normalizers/sort';
import {
  CategoryListNormalizer,
  CategoryNodeNormalizer,
  CategoryNormalizer,
  CategoryTreeNormalizer,
  DefaultProductCategoryService,
  GlueProductCategoryAdapter,
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
    useClass: MockProductListAdapter,
  },
  {
    provide: ProductRelationsListAdapter,
    useClass: MockProductRelationsListAdapter,
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
];

export const mockProductConnectors = [
  {
    provide: ProductAdapter,
    useClass: MockProductAdapter,
  },
  {
    provide: ProductListAdapter,
    useClass: MockProductListAdapter,
  },
  {
    provide: ProductRelationsListAdapter,
    useClass: MockProductRelationsListAdapter,
  },
  {
    provide: ProductCategoryAdapter,
    useClass: MockProductCategoryAdapter,
  },
];

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
  ...glueProductConnectors,
];

export const mockProductProviders = [
  ...productProviders,
  ...mockProductConnectors,
];
