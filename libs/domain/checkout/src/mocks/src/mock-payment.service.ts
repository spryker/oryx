import { PaymentMethod } from '@spryker-oryx/checkout';
import { Observable, of } from 'rxjs';
import { mockNormalizedPaymentMethods } from './mock-checkout';

export enum PaymentProviderType {
  Multiple = 'all',
  SingleProvider = 'single-provider',
  TwoProviders = 'two-providers',
  NoProvider = 'no-provider',
}

export class MockPaymentService {
  protected type = PaymentProviderType.Multiple;

  changeProviderType(value: PaymentProviderType) {
    this.type = value;
  }

  getMethods(): Observable<PaymentMethod[] | null> {
    switch (this.type) {
      case PaymentProviderType.SingleProvider:
        return of([
          mockNormalizedPaymentMethods[0],
          mockNormalizedPaymentMethods[1],
        ]);
        break;
      case PaymentProviderType.TwoProviders:
        return of([
          mockNormalizedPaymentMethods[0],
          mockNormalizedPaymentMethods[1],
          mockNormalizedPaymentMethods[2],
        ]);
        break;
      case PaymentProviderType.NoProvider:
        return of([]);
        break;
      case PaymentProviderType.Multiple:
      default:
        return of(
          mockNormalizedPaymentMethods.sort((a, b) =>
            a.provider.toLowerCase() < b.provider.toLowerCase()
              ? -1
              : a.provider.toLowerCase() > b.provider.toLowerCase()
              ? 1
              : 0
          )
        );
    }
  }

  select(): Observable<void> {
    return of();
  }

  selected(): Observable<PaymentMethod | null> {
    return of(null);
  }
}
