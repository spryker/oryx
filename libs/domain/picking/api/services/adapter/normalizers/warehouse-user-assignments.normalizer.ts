import { Transformer, TransformerService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  DeserializedWarehouseUserAssignment,
  WarehouseUserAssignmentNormalizer,
} from '@spryker-oryx/picking/api';
import { combineLatest, Observable, of } from 'rxjs';
import { WarehouseUserAssignment } from '../../../models';

export const WarehouseUserAssignmentsNormalizer =
  'oryx.WarehouseUserAssignmentsNormalizer*';

export function warehouseUserAssignmentItemsNormalizer(
  data: DeserializedWarehouseUserAssignment[],
  transformer: TransformerService
): Observable<WarehouseUserAssignment[]> {
  return data.length
    ? combineLatest(
        data.map((item) =>
          transformer.transform(item, WarehouseUserAssignmentNormalizer)
        )
      )
    : of([]);
}

export const warehouseUserAssignmentsNormalizer: Provider[] = [
  {
    provide: WarehouseUserAssignmentsNormalizer,
    useValue: warehouseUserAssignmentItemsNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [WarehouseUserAssignmentsNormalizer]: Transformer<
      WarehouseUserAssignment[]
    >[];
  }
}
