import { Observable } from 'rxjs';
import { WarehouseUserAssignment } from '../models/warehouse';

export interface WarehouseUserAssignmentsService {
  getList(): Observable<WarehouseUserAssignment[]>;
  activateAssignment(assignmentId: string): Observable<WarehouseUserAssignment>;
}

export const WarehouseUserAssignmentsService =
  'oryx.WarehouseUserAssignmentsService';

declare global {
  export interface InjectionTokensContractMap {
    [WarehouseUserAssignmentsService]: WarehouseUserAssignmentsService;
  }
}
