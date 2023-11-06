import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { CrudState } from '../../models';
import { AddressStateService } from './address-state.service';

export class DefaultAddressStateService implements AddressStateService {
  protected action = new BehaviorSubject<CrudState>(CrudState.Read);
  protected selected = new BehaviorSubject<string | null>(null);

  set(action: CrudState, id?: string | null): void {
    this.action.next(action);
    if (id !== undefined) {
      this.selected.next(id);
    }
  }

  get(): Observable<{ action: CrudState; selected: string | null }> {
    return this.action.pipe(
      switchMap((action) =>
        this.selected.pipe(map((selected) => ({ action, selected })))
      )
    );
  }

  clear(): void {
    this.action.next(CrudState.Read);
    this.selected.next(null);
  }
}
