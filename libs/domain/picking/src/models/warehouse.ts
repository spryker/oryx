export interface Warehouse {
  uuid: string;
  name: string;
  isActive?: boolean;
}

export interface WarehouseUserAssignment {
  id: string;
  isActive: boolean;
  userUuid: string;
  warehouse: Warehouse;
}
