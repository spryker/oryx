import { resolve } from '@spryker-oryx/di';
import { PickingListComponentProperties } from '@spryker-oryx/picking/picking-lists';
import {
  Type,
  asyncState,
  isDefined,
  observe,
  valueType,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import type { PickingList } from '../models';
import { PickingListService } from '../services';
import { log } from '@clack/prompts';

export declare class PickingListMixinInterface
  implements PickingListComponentProperties
{
  protected pickingListService: PickingListService;
  pickingListId?: string;
  protected pickingList$: Observable<PickingList>;
  protected pickingList: PickingList;
  protected upcomingPickingListId: string | null;
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
      switchMap((id) => this.pickingListService.get({ ids: [id] })),
      map((list) => list?.[0] ?? null)
    );

    @asyncState()
    protected pickingList = valueType(this.pickingList$);

    @asyncState()
    protected upcomingPickingListId = valueType(
      this.pickingListService.getUpcomingPickingListId()
    );
  }

  return PickingListMixinClass as unknown as Type<PickingListMixinInterface> &
    T;
};
