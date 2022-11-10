import {
  availabilityNormalizer,
  AvailabilityNormalizer,
  ConcreteProductsNormalizer,
  concreteProductsNormalizer,
  DefaultProductAdapter,
  DefaultProductListAdapter,
  ImagesNormalizer,
  imagesNormalizer,
  PriceNormalizer,
  priceNormalizer,
  ProductAdapter,
  ProductListAdapter,
  productNormalizer,
} from './adapter';
import {
  productLabelNormalizer,
  ProductLabelsNormalizer,
} from './adapter/normalizers/labels/labels.normalizer';

import { Provider } from '@spryker-oryx/injector';
import { productListNormalizer } from './adapter/normalizers/product-list';
import { DefaultProductListPageService } from './default-product-list-page.service';
import { DefaultProductListService } from './default-product-list.service';
import { DefaultProductService } from './default-product.service';
import { DefaultProductImageService } from './images';
import { ProductImageService } from './images/product-image.service';
import {
  productMediaConfig,
  ProductMediaConfig,
} from './images/product-media.config';
import { ProductListPageService } from './product-list-page.service';
import { ProductListService } from './product-list.service';
import { ProductService } from './product.service';

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
    provide: ProductListPageService,
    useClass: DefaultProductListPageService,
  },
  {
    provide: PriceNormalizer,
    useValue: priceNormalizer,
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
    provide: ImagesNormalizer,
    useValue: imagesNormalizer,
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
];
