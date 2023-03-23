/* eslint-disable @typescript-eslint/no-empty-function */

import { Observable, of } from 'rxjs';
import { PushService } from './push.service';

export class NoopPushService implements PushService {
  init(): Observable<void> {
    return of(undefined);
  }

  subscribe(): Observable<any> {
    return of(undefined);
  }
  unsubscribe(): Observable<boolean> {
    return of(false);
  }
}
