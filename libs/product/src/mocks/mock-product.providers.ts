import { CurrencyService } from '../services/currency.service';
import { DefaultCurrencyService } from '../services/default-currency.service';
import { DefaultLocaleService } from '../services/default-locale.service';
import { LocaleService } from '../services/locale.service';
import { ProductService } from '../services/product.service';
import { MockProductService } from './mock-product.service';

export const MOCK_PRODUCT_PROVIDERS = [
  {
    provide: ProductService,
    useClass: MockProductService,
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
