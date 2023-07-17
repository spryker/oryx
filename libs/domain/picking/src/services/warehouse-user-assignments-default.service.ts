import { inject } from '@spryker-oryx/di';
import { WarehouseUserAssignmentsAdapter } from '@spryker-oryx/picking';
import { Observable, tap } from 'rxjs';
import {
  WarehouseUserAssignment,
  warehouseUserAssignmentStorageKey,
} from '../models/warehouse-user-assignment';
import { WarehouseUserAssignmentsService } from './warehouse-user-assignments.service';
import { StorageService } from '@spryker-oryx/core';
import { AuthService, OauthService } from '@spryker-oryx/auth';

export class WarehouseUserAssignmentsDefaultService
  implements WarehouseUserAssignmentsService
{
  constructor(
    protected adapter = inject(WarehouseUserAssignmentsAdapter),
    protected storageService = inject(StorageService),
    protected authService = inject(AuthService)
  ) {
    authService.isAuthenticated().subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        this.storageService.remove(warehouseUserAssignmentStorageKey);
      }
    });
  }

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

        this.storageService.set(warehouseUserAssignmentStorageKey, assignment);
      })
    );
  }
}
