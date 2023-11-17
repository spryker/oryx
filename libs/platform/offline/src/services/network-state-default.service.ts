import {
  Observable,
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  startWith,
} from 'rxjs';
import { NetworkStateService } from './network-state.service';

export class NetworkStateDefaultService implements NetworkStateService {
  online(): Observable<boolean> {
    return merge(
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(
      startWith(navigator.onLine),
      map(() => navigator.onLine),
      distinctUntilChanged()
    );
  }
}
