import { inject } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import {
  GetPickingListResponse,
  PickingHttpService,
  PickingList,
  PickingListQualifier,
  PickingListDefaultAdapter
} from '@spryker-oryx/picking/api';
import { isDefined } from '@spryker-oryx/utilities';
// Add full import because of issue with naming exports from cjs.
import * as jsonapi from 'jsonapi-serializer';
import { firstValueFrom, Observable } from 'rxjs';
import {
  PickingListEntity,
  PickingListItemOffline,
  PickingListSerialized,
  PickingProductEntity,
} from '../../entities';
import { PickingListOnlineAdapter } from './picking-list-online.adapter';

export class PickingListOnlineDefaultAdapter
  extends PickingListDefaultAdapter
  implements PickingListOnlineAdapter
{
  constructor(
    pickingHttpSerivce = inject(PickingHttpService),
    deserializer = new jsonapi.Deserializer({
      keyForAttribute: 'camelCase',
    }),
    protected indexedDbService = inject(IndexedDbService)
  ) {
    super(pickingHttpSerivce, deserializer);
  }

  get(qualifier: PickingListQualifier): Observable<PickingListEntity[]> {
    return super.get(qualifier) as Observable<PickingListEntity[]>;
  }

  startPicking(pickingList: PickingListEntity): Observable<PickingListEntity> {
    return super.startPicking(pickingList) as Observable<PickingListEntity>;
  }

  updatePickingItems(
    pickingList: PickingListEntity
  ): Observable<PickingListEntity> {
    return super.updatePickingItems(
      pickingList
    ) as Observable<PickingListEntity>;
  }

  finishPicking(pickingList: PickingListEntity): Observable<PickingListEntity> {
    return super.finishPicking(pickingList) as Observable<PickingListEntity>;
  }

  protected override async parsePickingLists(
    response: GetPickingListResponse
  ): Promise<PickingListEntity[]> {
    const basePickingLists = await super.parsePickingLists(response);
    const pickingListStore = await firstValueFrom(
      this.indexedDbService.getStore(PickingListEntity)
    );
    const existingPickingLists = await pickingListStore
      .bulkGet(basePickingLists.map((pl) => pl.id))
      .then((pickingLists) => pickingLists.filter(isDefined));

    return this.pickingListsToEntity(basePickingLists, existingPickingLists);
  }

  protected pickingListsToEntity(
    pickingLists: PickingList[],
    existingPickingLists: PickingListSerialized[]
  ): PickingListEntity[] {
    return pickingLists.map((pickingList) => {
      const existingPickingList = existingPickingLists.find(
        (pl) => pl.id === pickingList.id
      );

      // Merge local status
      const localStatus =
        !existingPickingList ||
        pickingList.status !== existingPickingList.localStatus
          ? pickingList.status
          : existingPickingList.localStatus;

      const productSkus = pickingList.items.map((item) => item.product.sku);

      const items: PickingListItemOffline[] = pickingList.items.map((item) => ({
        ...item,
        productId: item.product.id,
        product: new PickingProductEntity(item.product),
      }));

      return new PickingListEntity({
        ...pickingList,
        items,
        productSkus,
        localStatus,
      });
    });
  }
}
