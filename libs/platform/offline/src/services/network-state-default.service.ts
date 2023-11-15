import {
  fromEvent,
  merge,
  Observable,
  of,
  map,
  distinctUntilChanged
} from 'rxjs';
import { NetworkStateService, NetworkState } from './network-state.service';

export class NetworkStateDefaultService implements NetworkStateService {
  get(): Observable<NetworkState> {
    return merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(
      map(() => navigator.onLine ? 'online': 'offline'),
      distinctUntilChanged(),
    )
  }
}
