import { Store, StoreAdapter } from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';
import { MockStore } from './mock-store';

export class MockStoreAdapter implements StoreAdapter {
  get(): Observable<Store[]> {
    return of([MockStore]);
  }
}
