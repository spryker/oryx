import { resolve } from '@spryker-oryx/di';
import { PickingListContext } from '@spryker-oryx/picking';
import {
  Signal,
  Type,
  computed,
  signal,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import {
  Observable,
  of,
} from 'rxjs';
import type { PickingList } from '../models';
import { PickingListService } from '../services';
import { ContextController } from '@spryker-oryx/core';

export declare class PickingListMixinInterface {
  pickingListId?: string;
  protected context: Observable<string | undefined>;
  protected pickingListService: PickingListService;
  protected $pickingList: Signal<PickingList>;
  protected $upcomingPickingListId: Signal<string | null>;
}

export const PickingListMixin = <
  T extends Type<LitElement>
>(
  superClass: T
): Type<PickingListMixinInterface> & T => {
  @signalAware()
  class PickingListMixinClass extends superClass {
    @signalProperty({ reflect: true }) pickingListId?: string;
    
    protected pickingListService = resolve(PickingListService);

    protected contextController = new ContextController(this);
    protected $context = signal(this.contextController.get<string>(PickingListContext.PickingListId));

    protected $pickingList = computed(() => {
      const id = this.pickingListId ?? this.$context();
      
      return id ? this.pickingListService.getList(id): of(null)
    })

    protected $upcomingPickingListId = signal(
      this.pickingListService.getUpcomingPickingListId()
    );
  }

  return PickingListMixinClass as unknown as Type<PickingListMixinInterface> &
    T;
};
