import { resolve } from '@spryker-oryx/di';
import { ListComponentProperties } from '@spryker-oryx/picking/lists';
import {
  Signal,
  Type,
  isDefined,
  observe,
  signal,
  signalAware,
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
} from 'rxjs';
import type { PickingList } from '../models';
import { PickingListService } from '../services';

export declare class PickingListMixinInterface
  implements ListComponentProperties
{
  protected pickingListService: PickingListService;
  pickingListId?: string;
  protected pickingList$: Observable<PickingList>;
  protected $pickingList: Signal<PickingList>;
  protected $upcomingPickingListId: Signal<string | null>;
}

export const PickingListMixin = <
  T extends Type<LitElement & ListComponentProperties>
>(
  superClass: T
): Type<PickingListMixinInterface> & T => {
  @signalAware()
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

    protected $pickingList = signal(this.pickingList$);

    protected $upcomingPickingListId = signal(
      this.pickingListService.getUpcomingPickingListId()
    );
  }

  return PickingListMixinClass as unknown as Type<PickingListMixinInterface> &
    T;
};
