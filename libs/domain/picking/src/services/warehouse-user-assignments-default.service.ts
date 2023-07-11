import { inject } from '@spryker-oryx/di';
import { WarehouseUserAssignmentsAdapter } from '@spryker-oryx/picking';
import { Observable, tap } from 'rxjs';
import { WarehouseUserAssignment } from '../models/warehouse';
import { WarehouseUserAssignmentsService } from './warehouse-user-assignments.service';

export class WarehouseUserAssignmentsDefaultService
  implements WarehouseUserAssignmentsService
{
  constructor(protected adapter = inject(WarehouseUserAssignmentsAdapter)) {}

  getList(): Observable<WarehouseUserAssignment[]> {
    return this.adapter.getList();
  }

  activateAssignment(
    assignmentId: string
  ): Observable<WarehouseUserAssignment> {
    return this.adapter.activateAssignment(assignmentId).pipe(
      tap((assignment) => {
        if (!assignment.isActive) {
          throw new Error(
            'WarehouseUserAssignmentsService: Warehouse is not assigned!'
          );
        }
      })
    );
  }
}
