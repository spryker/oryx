import {
  DeserializedWarehouseUserAssignment,
  warehouseUserAssignmentAttributeNormalizer,
} from '@spryker-oryx/picking';

const mockWarehouseUserAssignmentDeserializedData: DeserializedWarehouseUserAssignment =
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
  };

describe('Warehouse user assignment Normalizer', () => {
  it('should transform DeserializedWarehouseUserAssignment into WarehouseUserAssignment', () => {
    const normalized = warehouseUserAssignmentAttributeNormalizer(
      mockWarehouseUserAssignmentDeserializedData
    );
    expect(normalized).toEqual({
      id: mockWarehouseUserAssignmentDeserializedData.id,
      isActive: mockWarehouseUserAssignmentDeserializedData.isActive,
      userUuid: mockWarehouseUserAssignmentDeserializedData.userUuid,
      warehouse: mockWarehouseUserAssignmentDeserializedData.warehouse,
    });
  });
});
