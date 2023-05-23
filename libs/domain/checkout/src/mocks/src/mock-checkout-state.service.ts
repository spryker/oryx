import { StorageService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import { DefaultCheckoutStateService } from '../../services';

class MockStorageService implements StorageService {
  get(): Observable<any> {
    return of('');
  }
  set(): Observable<void> {
    return of();
  }
  remove(): Observable<void> {
    return of();
  }
  clear(): Observable<void> {
    return of();
  }
}

export class MockCheckoutStateService extends DefaultCheckoutStateService {
  constructor(protected storage = inject(MockStorageService)) {
    super();
  }
}
