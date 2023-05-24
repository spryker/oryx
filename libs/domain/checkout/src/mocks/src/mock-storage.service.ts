import { StorageService } from '@spryker-oryx/core';
import { Observable, of } from 'rxjs';

// we like to avoid storing data in storybook to avoid different results on each visit of the stories
export class MockStorageService implements StorageService {
  get(): Observable<any> {
    return of();
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
