import { resolve } from '@spryker-oryx/di';
import { PickingListComponentProperties } from '@spryker-oryx/picking';
import {
  PickingList,
  PickingListService,
} from '@spryker-oryx/picking/services';
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

export declare class PickingListMixinInterface
  implements PickingListComponentProperties
{
  protected pickingListService: PickingListService;
  pickingListId?: string;
  protected pickingList$: Observable<PickingList>;
  protected $pickingList: Signal<PickingList>;
  protected $upcomingPickingListId: Signal<string | null>;
}

export const PickingListMixin = <
  T extends Type<LitElement & PickingListComponentProperties>
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
