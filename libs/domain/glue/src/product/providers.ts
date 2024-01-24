import { Provider } from '@spryker-oryx/di';
import {
  AvailabilityNormalizer,
  CategoryIdNormalizer,
  CategoryListNormalizer,
  CategoryNodeNormalizer,
  CategoryNormalizer,
  CategoryTreeNormalizer,
  ConcreteProductsNormalizer,
  FacetCategoryNormalizer,
  FacetNormalizer,
  FacetRangeNormalizer,
  FacetRatingNormalizer,
  PaginationNormalizer,
  PriceNormalizer,
  ProductAdapter,
  ProductCategoryAdapter,
  ProductLabelsNormalizer,
  ProductListAdapter,
  ProductMediaSetNormalizer,
  ProductRelationsListAdapter,
  SortNormalizer,
} from '@spryker-oryx/product';
import {
  DefaultProductAdapter,
  DefaultProductCategoryAdapter,
  DefaultProductListAdapter,
  DefaultProductMediaNormalizer,
  DefaultProductRelationsListAdapter,
  availabilityNormalizer,
  categoryIdNormalizer,
  categoryListNormalizerFactory,
  categoryNodeNormalizer,
  categoryNormalizerFactory,
  categoryTreeNormalizer,
  concreteProductsNormalizer,
  facetCategoryNormalizer,
  facetRatingNormalizer,
  facetsNormalizer,
  facetsRangeNormalizer,
  mediaNormalizer,
  mediaSetNormalizer,
  paginationNormalizer,
  priceNormalizer,
  productIncludes,
  productLabelNormalizer,
  productListNormalizer,
  productNormalizer,
} from './adapter';
import { relationsListNormalizer } from './adapter/normalizers/relations-list';
import { sortNormalizer } from './adapter/normalizers/sort';
import { productListIncludes } from './adapter/product-list-includes';

export const glueProductProviders: Provider[] = [
  {
    provide: ProductAdapter,
    useClass: DefaultProductAdapter,
  },
  {
    provide: ProductListAdapter,
    useClass: DefaultProductListAdapter,
  },
  {
    provide: ProductRelationsListAdapter,
    useClass: DefaultProductRelationsListAdapter,
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
  ...productNormalizer,
  ...productListNormalizer,
  ...relationsListNormalizer,
  ...productIncludes,
  ...productListIncludes,
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
    provide: CategoryIdNormalizer,
    useValue: categoryIdNormalizer,
  },
];
