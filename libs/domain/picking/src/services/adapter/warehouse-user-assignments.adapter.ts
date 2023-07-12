import { Observable } from 'rxjs';
import { WarehouseUserAssignment } from '../../models/warehouse';

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
