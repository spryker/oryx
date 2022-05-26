import { DefaultProductAdapter } from './adapter/default-product.adapter';
import { ProductAdapter } from './adapter/product.adapter';
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
];
