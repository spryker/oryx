import { inject } from '@spryker-oryx/di';
import {
  PatchWarehouseUserAssignmentsResponse,
  PickingHttpService,
} from '@spryker-oryx/picking';
import * as jsonapi from 'jsonapi-serializer';
import { Observable, switchMap } from 'rxjs';
import { Warehouse, WarehouseUserAssignment } from '../../models/warehouse';
import { LinksObject } from './types';
import {
  GetWarehouseUserAssignmentsResponse,
  WarehouseUserAssignmentsAdapter,
} from './warehouse-user-assignments.adapter';

export class WarehouseUserAssignmentsDefaultAdapter
  implements WarehouseUserAssignmentsAdapter
{
  constructor(
    protected pickingHttpService = inject(PickingHttpService),
    protected deserializer = new jsonapi.Deserializer({
      keyForAttribute: 'camelCase',
    })
  ) {}

  protected endpoint = '/warehouse-user-assignments';

  getList(): Observable<WarehouseUserAssignment[]> {
    return this.pickingHttpService
      .get<GetWarehouseUserAssignmentsResponse>(this.endpoint)
      .pipe(
        switchMap((res: GetWarehouseUserAssignmentsResponse) =>
          this.parseWarehouseUserAssignmentsList(res)
        )
      );
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
      .pipe(
        switchMap((res: PatchWarehouseUserAssignmentsResponse) =>
          this.parseWarehouseUserAssignment(res)
        )
      );
  }

  protected mapToWarehouseUserAssignment(
    data: WarehouseUserAssignmentsResponseData
  ): WarehouseUserAssignment {
    return {
      id: data.id,
      isActive: data.isActive,
      userUuid: data.userUuid,
      warehouse: data.warehouse,
    };
  }

  protected async parseWarehouseUserAssignmentsList(
    response: GetWarehouseUserAssignmentsResponse
  ): Promise<WarehouseUserAssignment[]> {
    const deserializedData: WarehouseUserAssignmentsResponseData[] =
      await this.deserializer.deserialize(response);

    return deserializedData.map(this.mapToWarehouseUserAssignment);
  }

  protected async parseWarehouseUserAssignment(
    response: PatchWarehouseUserAssignmentsResponse
  ): Promise<WarehouseUserAssignment> {
    const deserializedData: WarehouseUserAssignmentsResponseData =
      await this.deserializer.deserialize(response);

    return this.mapToWarehouseUserAssignment(deserializedData);
  }
}

export interface WarehouseUserAssignmentsResponseData extends LinksObject {
  id: string;
  isActive: boolean;
  userUuid: string;
  warehouse: Warehouse;
}
