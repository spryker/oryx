import { Transformer, TransformerService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { Observable, combineLatest, of } from 'rxjs';
import {
  DeserializedWarehouseUserAssignment,
  WarehouseUserAssignment,
} from '../../../models';
import { WarehouseUserAssignmentNormalizer } from './warehouse-user-assignment.normalizer';

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
