import { WarehouseUserAssignmentsService } from '@spryker-oryx/picking';
import { Observable, of } from 'rxjs';
import { WarehouseUserAssignment } from '../../src/models/warehouse-user-assignment';
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
