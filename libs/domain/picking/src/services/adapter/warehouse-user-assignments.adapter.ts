import { Observable } from 'rxjs';
import { WarehouseUserAssignment } from '../../models/warehouse';
import { LinksObject, ResourceObject } from './types';

export interface WarehouseUserAssignmentsAdapter {
  getList(): Observable<WarehouseUserAssignment[]>;
  activateAssignment(assignmentId: string): Observable<WarehouseUserAssignment>;
}

export const WarehouseUserAssignmentsAdapter =
  'oryx.WarehouseUserAssignmentsAdapter';

declare global {
  interface InjectionTokensContractMap {
    [WarehouseUserAssignmentsAdapter]: WarehouseUserAssignmentsAdapter;
  }
}

export interface GetWarehouseUserAssignmentsResponse {
  data: WarehouseUserAssignmentsResponseData[];
  links: LinksObject;
}

export interface PatchWarehouseUserAssignmentsResponse {
  data: WarehouseUserAssignmentsResponseData;
}

interface WarehouseUserAssignmentsResponseData extends ResourceObject {
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
