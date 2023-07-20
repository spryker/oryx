import { Observable } from 'rxjs';
import { WarehouseUserAssignment } from '../models/warehouse-user-assignment';

export interface WarehouseUserAssignmentsService {
  getList(): Observable<WarehouseUserAssignment[]>;
  getUserAssignment(): Observable<WarehouseUserAssignment | null>;
  activateAssignment(assignmentId: string): Observable<WarehouseUserAssignment>;
}

export const WarehouseUserAssignmentsService =
  'oryx.WarehouseUserAssignmentsService';

declare global {
  export interface InjectionTokensContractMap {
    [WarehouseUserAssignmentsService]: WarehouseUserAssignmentsService;
  }
}
