import {
  Observable,
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  of,
} from 'rxjs';
import { NetworkStateService } from './network-state.service';

export class NetworkStateDefaultService implements NetworkStateService {
  online(): Observable<boolean> {
    return merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(
      map(() => navigator.onLine),
      distinctUntilChanged()
    );
  }
}
