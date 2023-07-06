import { WarehouseUserAssignment } from '../../src/models/warehouse';

export const mockWarehouseUserAssignments: WarehouseUserAssignment[] = [
  {
    id: '1',
    isActive: true,
    userUuid: 'userUuid1',
    warehouse: {
      uuid: 'warehouseUuid1',
      name: 'warehouse1',
      isActive: true,
    },
  },
  {
    id: '2',
    isActive: false,
    userUuid: 'userUuid1',
    warehouse: {
      uuid: 'warehouseUuid2',
      name: 'warehouse2',
      isActive: true,
    },
  },
  {
    id: '3',
    isActive: false,
    userUuid: 'userUuid1',
    warehouse: {
      uuid: 'warehouseUuid3',
      name: 'warehouse3',
      isActive: true,
    },
  },
];
