import { Store, StoreService } from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';

export class MockStoreService implements Partial<StoreService> {
  static mockStore: Store = {
    id: 'DE',
    countries: [
      {
        iso2Code: 'DE',
        name: 'Germany',
        postalCodeMandatory: true,
        postalCodeRegex: '\\d{5}',
      },
      {
        iso2Code: 'US',
        name: 'United States',
        postalCodeMandatory: true,
        postalCodeRegex: '\\d{5}',
      },
    ],
    defaultCurrency: 'EUR',
    currencies: [
      {
        code: 'EUR',
        name: 'Euro',
      },
      {
        code: 'USD',
        name: 'US Dollar',
      },
    ],
    locales: [
      {
        code: 'en',
        name: 'en_US',
      },
      {
        code: 'de',
        name: 'de_DE',
      },
    ],
    timeZone: 'Europe/Berlin',
  };

  get(): Observable<Store | null> {
    return of(MockStoreService.mockStore);
  }
}
