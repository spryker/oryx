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
  DefaultProductCategoryService,
  ProductCategoryService,
  categoryEffects,
  categoryQueries,
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
  ProductListPageService,
  ProductListService,
} from './list';
import {
  ProductContext,
  ProductContextFallback,
  productContextProviders,
} from './product-context';
import { ProductService } from './product.service';
import {
  DefaultProductRelationsListService,
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
    provide: ProductService,
    useClass: DefaultProductService,
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
    provide: ProductListPageService,
    useClass: DefaultProductListPageService,
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
