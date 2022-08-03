import { StorageService } from '@spryker-oryx/core';
import { Observable, of } from 'rxjs';

export class ServerStorageService implements StorageService {
  get(): Observable<null> {
    return of(null);
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
