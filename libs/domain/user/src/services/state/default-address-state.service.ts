import { BehaviorSubject, Observable } from 'rxjs';
import { CrudState } from '../../models';
import { AddressStateService } from './address-state.service';

export class DefaultAddressStateService implements AddressStateService {
  protected action = new BehaviorSubject<CrudState>(CrudState.Read);
  protected _selected = new BehaviorSubject<string | null>(null);

  setAction(action: CrudState): void {
    this.action.next(action);
  }

  getAction(): Observable<CrudState> {
    return this.action;
  }

  select(id: string | null): void {
    if (this._selected.value !== id) this._selected.next(id);
  }

  selected(): Observable<string | null> {
    return this._selected.asObservable();
  }
}
