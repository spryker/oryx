import { resolve, Type } from '@spryker-oryx/di';
import { asyncState, observe, valueType } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import {
  BehaviorSubject,
  Observable,
  switchMap,
} from 'rxjs';
import type { PickingListComponentProperties, PickingList } from '../models';
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
  class AddressMixinClass extends superClass {
    protected pickingListService = resolve(PickingListService);

    @property() pickingListId?: string;

    @observe()
    protected pickingListId$ = new BehaviorSubject(this.pickingListId);

    protected pickingList$ = this.pickingListId$.pipe(
      switchMap(id => this.pickingListService.getById(id))
    );

    @asyncState()
    protected pickingList = valueType(this.pickingList$);
  }

  return AddressMixinClass as unknown as Type<PickingListMixinInterface> & T;
};
