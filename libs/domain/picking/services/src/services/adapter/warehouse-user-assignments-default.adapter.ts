import { JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import * as jsonapi from 'jsonapi-serializer';
import { Observable } from 'rxjs';
import {
  GetWarehouseUserAssignmentsResponse,
  PatchWarehouseUserAssignmentsResponse,
} from '../../models';
import { WarehouseUserAssignment } from '../../models/warehouse-user-assignment';
import { PickingHttpService } from '../picking-http.service';
import {
  WarehouseUserAssignmentNormalizer,
  WarehouseUserAssignmentsNormalizer,
} from './normalizers';
import { WarehouseUserAssignmentsAdapter } from './warehouse-user-assignments.adapter';

export class WarehouseUserAssignmentsDefaultAdapter
  implements WarehouseUserAssignmentsAdapter
{
  constructor(
    protected pickingHttpService = inject(PickingHttpService),
    protected transformer = inject(JsonAPITransformerService),
    protected deserializer = new jsonapi.Deserializer({
      keyForAttribute: 'camelCase',
    })
  ) {}

  protected endpoint = '/warehouse-user-assignments';

  getList(): Observable<WarehouseUserAssignment[]> {
    return this.pickingHttpService
      .get<GetWarehouseUserAssignmentsResponse>(this.endpoint)
      .pipe(this.transformer.do(WarehouseUserAssignmentsNormalizer));
  }

  activateAssignment(
    assignmentId: string
  ): Observable<WarehouseUserAssignment> {
    return this.pickingHttpService
      .patch<PatchWarehouseUserAssignmentsResponse>(
        `${this.endpoint}/${assignmentId}`,
        {
          data: {
            attributes: {
              isActive: true,
            },
          },
        }
      )
      .pipe(this.transformer.do(WarehouseUserAssignmentNormalizer));
  }
}
