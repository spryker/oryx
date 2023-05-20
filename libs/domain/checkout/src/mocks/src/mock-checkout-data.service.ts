import { Observable, of } from 'rxjs';

export class MockCheckoutDataService {
  protected mock: any;

  setMock(mock: any) {
    this.mock = mock;
  }

  get(): Observable<any> {
    return of(this.mock);
  }
}
