import {
  DeserializedWarehouseUserAssignment,
  warehouseUserAssignmentItemsNormalizer,
  WarehouseUserAssignmentNormalizer,
} from '@spryker-oryx/picking';
import { of, take } from 'rxjs';

const mockWarehouseUserAssignmentsDeserializedData: DeserializedWarehouseUserAssignment[] =
  [
    {
      id: '1',
      isActive: true,
      self: '',
      userUuid: 'userUuid1',
      warehouse: {
        uuid: 'warehouseUuid1',
        name: 'warehouse1',
        isActive: true,
      },
    },
  ];

const mockTransformed = 'mockTransformed';

const mockTransformer = {
  do: vi.fn().mockReturnValue(() => of(mockTransformed)),
  transform: vi.fn().mockReturnValue(of(mockTransformed)),
};

describe('Warehouse user assignments Normalizer', () => {
  it('should transform DeserializedWarehouseUserAssignment array into WarehouseUserAssignment array', () => {
    warehouseUserAssignmentItemsNormalizer(
      mockWarehouseUserAssignmentsDeserializedData,
      mockTransformer
    )
      .pipe(take(1))
      .subscribe((normalized) => {
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockWarehouseUserAssignmentsDeserializedData[0],
          WarehouseUserAssignmentNormalizer
        );
        expect(normalized).toEqual([mockTransformed]);
      });
  });
});
