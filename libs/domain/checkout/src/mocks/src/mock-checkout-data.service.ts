import { Observable, of } from 'rxjs';
import { CheckoutData } from '../../models';

export class MockCheckoutDataService {
  protected mock: any;

  setMock(mock: any) {
    this.mock = mock;
  }

  get<K extends keyof CheckoutData>(
    key: K
  ): Observable<CheckoutData[K] | undefined> {
    return of(this.mock?.[key]);
  }
}
