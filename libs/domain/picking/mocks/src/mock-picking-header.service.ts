import { PickingHeaderService } from '@spryker-oryx/picking';
import { Observable, of } from 'rxjs';

export class MockPickingHeaderService implements Partial<PickingHeaderService> {
  cancel(): void {
    //mock
  }

  discard(): void {
    //mock
  }

  showDialog(): Observable<boolean> {
    return of(false);
  }
}
