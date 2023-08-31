import { PickingSyncActionHandlerService } from '@spryker-oryx/picking/offline';
import { Observable, of } from 'rxjs';

export class MockPickingSyncActionHandlerService
  implements Partial<PickingSyncActionHandlerService>
{
  isSyncing(): Observable<boolean> {
    return of(false);
  }
}
