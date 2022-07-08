import {
  DefaultProductAdapter,
  imagesNormalizer,
  ImagesNormalizer,
  priceNormalizer,
  PriceNormalizer,
  ProductAdapter,
  productNormalizer,
  ProductNormalizer,
} from './adapter';
import { CurrencyService } from './currency.service';
import { DefaultCurrencyService } from './default-currency.service';
import { DefaultLocaleService } from './default-locale.service';
import { DefaultProductService } from './default-product.service';
import { LocaleService } from './locale.service';
import { ProductService } from './product.service';

export const PRODUCT_PROVIDERS = [
  {
    provide: ProductAdapter,
    useClass: DefaultProductAdapter,
  },
  {
    provide: ProductService,
    useClass: DefaultProductService,
  },
  {
    provide: CurrencyService,
    useClass: DefaultCurrencyService,
  },
  {
    provide: LocaleService,
    useClass: DefaultLocaleService,
  },
  {
    provide: PriceNormalizer,
    useValue: priceNormalizer,
  },
  {
    provide: ImagesNormalizer,
    useValue: imagesNormalizer,
  },
  {
    provide: ProductNormalizer,
    useValue: productNormalizer,
  },
];
