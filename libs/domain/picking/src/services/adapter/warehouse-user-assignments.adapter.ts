import { Observable } from 'rxjs';
import { WarehouseUserAssignment } from '../../models/warehouse-user-assignment';

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
