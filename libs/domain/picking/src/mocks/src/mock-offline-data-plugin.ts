import { App } from '@spryker-oryx/core';
import { OfflineDataPlugin } from '@spryker-oryx/picking/offline';
import { Observable, of } from 'rxjs';

export class MockOfflineDataPlugin extends OfflineDataPlugin {
  apply(app: App): void | Promise<void> {
    //mock
  }

  refreshData(): Observable<void> {
    return of(undefined);
  }
}
