import { resolve, Type } from '@spryker-oryx/di';
import {
  asyncState,
  isDefined,
  observe,
  valueType,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import type { PickingList, PickingListComponentProperties } from '../models';
import { PickingListService } from '../services';

export declare class PickingListMixinInterface
  implements PickingListComponentProperties
{
  protected pickingListService: PickingListService;
  pickingListId?: string;
  protected pickingList$: Observable<PickingList>;
  protected pickingList: PickingList;
}

export const PickingListMixin = <
  T extends Type<LitElement & PickingListComponentProperties>
>(
  superClass: T
): Type<PickingListMixinInterface> & T => {
  class PickingListMixinClass extends superClass {
    protected pickingListService = resolve(PickingListService);

    @property() pickingListId?: string;

    @observe()
    protected pickingListId$ = new BehaviorSubject(this.pickingListId);

    protected pickingList$ = this.pickingListId$.pipe(
      distinctUntilChanged(),
      filter(isDefined),
      switchMap((id) => this.pickingListService.get({id})),
      map(data => data?.length ? data[0] : null)
    );

    @asyncState()
    protected pickingList = valueType(this.pickingList$);
  }

  return PickingListMixinClass as unknown as Type<PickingListMixinInterface> &
    T;
};
