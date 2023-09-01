import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import {
  AvailabilityNormalizer,
  CategoriesNormalizer,
  CategoryIdNormalizer,
  ConcreteProductsNormalizer,
  DefaultProductAdapter,
  DefaultProductMediaNormalizer,
  FacetCategoryNormalizer,
  FacetNormalizer,
  FacetRangeNormalizer,
  PriceNormalizer,
  ProductAdapter,
  ProductMediaSetNormalizer,
  availabilityNormalizer,
  categoriesNormalizer,
  categoryIdNormalizer,
  concreteProductsNormalizer,
  facetCategoryNormalizer,
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
  PaginationNormalizer,
  paginationNormalizer,
} from './adapter/normalizers/pagination';
import { relationsListNormalizer } from './adapter/normalizers/relations-list';
import { SortNormalizer, sortNormalizer } from './adapter/normalizers/sort';
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
  ...relationsListNormalizer,
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
  {
    provide: CategoryIdNormalizer,
    useValue: categoryIdNormalizer,
  },
  {
    provide: CategoriesNormalizer,
    useValue: categoriesNormalizer,
  },
  ProductListBreadcrumb,
  ProductDetailsBreadcrumb,
  ...provideLitRoutes({ routes: productRoutes }),
];
