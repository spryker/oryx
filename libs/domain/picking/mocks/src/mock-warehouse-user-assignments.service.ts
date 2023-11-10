import {
  WarehouseUserAssignment,
  WarehouseUserAssignmentsService,
} from '@spryker-oryx/picking/api';
import { Observable, of } from 'rxjs';
import { mockWarehouseUserAssignments } from './mock-warehouse-user-assignments';

export class MockWarehouseUserAssignmentsService
  implements Partial<WarehouseUserAssignmentsService>
{
  getList(): Observable<WarehouseUserAssignment[]> {
    return of(mockWarehouseUserAssignments);
  }

  activateAssignment(
    assignmentId: string
  ): Observable<WarehouseUserAssignment> {
    return of({
      id: assignmentId,
      isActive: true,
      userUuid: `userUuid${assignmentId}`,
      warehouse: {
        uuid: `warehouseUuid${assignmentId}`,
        name: `warehouse${assignmentId}`,
        isActive: true,
      },
    });
  }
}
