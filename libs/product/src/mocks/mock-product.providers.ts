import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { delay, Observable, of } from 'rxjs';
import { CurrencyService } from '../services/currency.service';
import { DefaultCurrencyService } from '../services/default-currency.service';
import { DefaultLocaleService } from '../services/default-locale.service';
import { LocaleService } from '../services/locale.service';
import { ProductService } from '../services/product.service';
import { MockProductService } from './mock-product.service';

export const MOCK_CART_PROVIDERS = [
  {
    provide: 'FES.CartService',
    useValue: {
      addEntry: (): Observable<null> => of(null).pipe(delay(1000)),
    },
  },
];

export const MOCK_SEMANTIC_LINK_PROVIDERS = [
  {
    provide: 'FES.SemanticLinkService',
    useValue: {
      get: (): Observable<string> =>
        of(window.parent?.location.href ?? window.location.href),
    },
  },
];

export const MOCK_PRODUCT_PROVIDERS = [
  {
    provide: ContextService,
    useClass: DefaultContextService,
  },
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
  ...MOCK_CART_PROVIDERS,
  ...MOCK_SEMANTIC_LINK_PROVIDERS,
];
