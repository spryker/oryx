import { LinksObject, ResourceObject } from '../services/adapter/types';
import { Warehouse } from './warehouse-user-assignment';

export interface DeserializedWarehouseUserAssignment extends LinksObject {
  id: string;
  isActive: boolean;
  userUuid: string;
  warehouse: Warehouse;
}

export interface GetWarehouseUserAssignmentsResponse {
  data: WarehouseUserAssignmentsResponse[];
  links: LinksObject;
}

export interface PatchWarehouseUserAssignmentsResponse {
  data: WarehouseUserAssignmentsResponse;
}

interface WarehouseUserAssignmentsResponse extends ResourceObject {
  attributes: {
    userUuid: string;
    isActive: boolean;
    warehouse: {
      name: string;
      uuid: string;
      isActive: boolean;
    };
  };
}
