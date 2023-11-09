import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { DeserializedWarehouseUserAssignment } from '@spryker-oryx/picking/api';
import { WarehouseUserAssignment } from '../../../models';

export const WarehouseUserAssignmentNormalizer =
  'oryx.WarehouseUserAssignmentNormalizer*';

export function warehouseUserAssignmentAttributeNormalizer(
  data: DeserializedWarehouseUserAssignment
): WarehouseUserAssignment {
  return {
    id: data.id,
    isActive: data.isActive,
    userUuid: data.userUuid,
    warehouse: data.warehouse,
  };
}

export const warehouseUserAssignmentNormalizer: Provider[] = [
  {
    provide: WarehouseUserAssignmentNormalizer,
    useValue: warehouseUserAssignmentAttributeNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [WarehouseUserAssignmentNormalizer]: Transformer<WarehouseUserAssignment>[];
  }
}
